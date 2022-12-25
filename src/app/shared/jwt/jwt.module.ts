import type { DynamicModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { JwtModule as _JwtModule } from "@nestjs/jwt";
import type { Observable } from "rxjs";
import { first, interval, lastValueFrom, map, race, Subject } from "rxjs";

import type { IJwtConfig } from "./interfaces";
import { JWT_SERVICES } from "./services";

@Module({
	providers: JWT_SERVICES,
	exports: JWT_SERVICES
})
export class JwtModule {
	static moduleSubject = new Subject<DynamicModule>();

	static forRoot(jwtConfig: IJwtConfig): DynamicModule {
		const dynamicModule = {
			module: JwtModule,
			imports: [_JwtModule.register(jwtConfig)]
		};

		JwtModule.moduleSubject.next(dynamicModule);

		return dynamicModule;
	}

	static async forChild(): Promise<DynamicModule> {
		const timeout$: Observable<DynamicModule> = interval(0).pipe(
			map(() => {
				throw new Error("Expected at least one forRoot");
			})
		);

		return lastValueFrom(race(timeout$, JwtModule.moduleSubject.asObservable()).pipe(first()));
	}
}

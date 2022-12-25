import { HttpModule } from "@nestjs/axios";
import type { DynamicModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import type { Observable } from "rxjs";
import { first, interval, lastValueFrom, map, race, Subject } from "rxjs";

import type { IApiConfig } from "./interfaces";
import { API_SERVICES } from "./services";

@Module({
	providers: API_SERVICES,
	exports: API_SERVICES
})
export class ApiModule {
	static moduleSubject = new Subject<DynamicModule>();

	static forRoot(config: IApiConfig): DynamicModule {
		const dynamicModule = {
			module: ApiModule,
			imports: [HttpModule.register(config)]
		};

		ApiModule.moduleSubject.next(dynamicModule);

		return dynamicModule;
	}

	static async forChild(): Promise<DynamicModule> {
		const timeout$: Observable<DynamicModule> = interval(0).pipe(
			map(() => {
				throw new Error("Expected at least one forRoot");
			})
		);

		return lastValueFrom(race(timeout$, ApiModule.moduleSubject.asObservable()).pipe(first()));
	}
}

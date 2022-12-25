import type { DynamicModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import type { Observable } from "rxjs";
import { first, interval, lastValueFrom, map, race, Subject } from "rxjs";

import { CRYPTO_CONFIG } from "./injection-tokens";
import type { ICryptoConfig } from "./interfaces";
import { CRYPTO_SERVICES } from "./services";

@Module({
	providers: CRYPTO_SERVICES,
	exports: CRYPTO_SERVICES
})
export class CryptoModule {
	static moduleSubject = new Subject<DynamicModule>();

	static forRoot(cryptoConfig: ICryptoConfig): DynamicModule {
		const dynamicModule: DynamicModule = {
			module: CryptoModule,
			providers: [
				{
					provide: CRYPTO_CONFIG,
					useValue: cryptoConfig
				}
			]
		};

		CryptoModule.moduleSubject.next(dynamicModule);

		return dynamicModule;
	}

	static async forChild(): Promise<DynamicModule> {
		const timeout$: Observable<DynamicModule> = interval(0).pipe(
			map(() => {
				throw new Error("Expected at least one forRoot");
			})
		);

		return lastValueFrom(race(timeout$, CryptoModule.moduleSubject.asObservable()).pipe(first()));
	}
}

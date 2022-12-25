import type { DynamicModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import type { Observable } from "rxjs";
import { first, interval, lastValueFrom, map, race, Subject } from "rxjs";

import { MESSAGES_CONFIG } from "./injection-tokens";
import type { IMessagesConfig } from "./interfaces";
import { MESSAGES_SERVICES } from "./services";

@Module({
	imports: [],
	providers: MESSAGES_SERVICES,
	exports: MESSAGES_SERVICES
})
export class MessagesModule {
	static moduleSubject = new Subject<DynamicModule>();

	static forRoot(messagesConfig: IMessagesConfig): DynamicModule {
		const dynamicModule: DynamicModule = {
			module: MessagesModule,
			imports: [
				// TwilioModule.forRoot({
				// 	accountSid: messagesConfig.twilioAccountSid,
				// 	authToken: messagesConfig.twilioAuthToken
				// })
			],
			providers: [
				{
					provide: MESSAGES_CONFIG,
					useValue: messagesConfig
				}
			]
		};

		MessagesModule.moduleSubject.next(dynamicModule);

		return dynamicModule;
	}

	static async forChild(): Promise<DynamicModule> {
		const timeout$: Observable<DynamicModule> = interval(0).pipe(
			map(() => {
				throw new Error("Expected at least one forRoot");
			})
		);

		return lastValueFrom(race(timeout$, MessagesModule.moduleSubject.asObservable()).pipe(first()));
	}
}

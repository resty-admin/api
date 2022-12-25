import type { DynamicModule } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import type { Observable } from "rxjs";
import { first, interval, lastValueFrom, map, race, Subject } from "rxjs";

import { MAILS_CONFIG } from "./injection-tokens";
import type { IMailsConfig } from "./interfaces";
import { MAILS_SERVICES } from "./services";

@Module({
	imports: [MailerModule],
	providers: MAILS_SERVICES,
	exports: MAILS_SERVICES
})
export class MailsModule {
	static moduleSubject = new Subject<DynamicModule>();

	static forRoot(mailsConfig: IMailsConfig): DynamicModule {
		const dynamicModule: DynamicModule = {
			module: MailsModule,
			imports: [
				MailerModule.forRoot({
					transport: {
						host: "smtp.gmail.com",
						secure: false,
						auth: {
							user: mailsConfig.gmailUser,
							pass: mailsConfig.gmailPassword
						}
					}
				})
			],
			providers: [
				{
					provide: MAILS_CONFIG,
					useValue: mailsConfig
				}
			]
		};

		MailsModule.moduleSubject.next(dynamicModule);

		return dynamicModule;
	}

	static async forChild(): Promise<DynamicModule> {
		const timeout$: Observable<DynamicModule> = interval(0).pipe(
			map(() => {
				throw new Error("Expected at least one forRoot");
			})
		);

		return lastValueFrom(race(timeout$, MailsModule.moduleSubject.asObservable()).pipe(first()));
	}
}

import { Inject, Injectable } from "@nestjs/common";
import type { ISendMailOptions } from "@nestjs-modules/mailer";
import { MailerService } from "@nestjs-modules/mailer";

import { MAILS_CONFIG } from "../injection-tokens";
import { IMailsConfig } from "../interfaces";

@Injectable()
export class MailsService {
	constructor(
		@Inject(MAILS_CONFIG) private readonly _mailsConfig: IMailsConfig,
		private readonly _mailerService: MailerService
	) {}

	async send(to: string, text: string, options?: ISendMailOptions) {
		return this._mailerService.sendMail({
			to,
			text,
			from: this._mailsConfig.from,
			...options
		});
	}
}

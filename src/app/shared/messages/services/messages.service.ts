import { Inject } from "@nestjs/common";
import { TwilioService } from "nestjs-twilio";

import { MESSAGES_CONFIG } from "../injection-tokens";
import { IMessagesConfig } from "../interfaces";

export class MessagesService {
	constructor(
		@Inject(MESSAGES_CONFIG) private readonly _messagesConfig: IMessagesConfig,
		private readonly _twilioService: TwilioService
	) {}

	async send(to: string, body: string, options?: any): Promise<any> {
		return this._twilioService.client.messages.create({
			to,
			body,
			messagingServiceSid: this._messagesConfig.twilioServiceSid,
			...options
		});
	}
}

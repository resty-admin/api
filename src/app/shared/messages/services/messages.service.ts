export class MessagesService {
	// constructor(
	// 	@Inject(MESSAGES_CONFIG) private readonly _messagesConfig: IMessagesConfig,
	// 	private readonly _twilioService: TwilioService
	// ) {}

	// async send(to: string, body: string, options?: any) {
	// 	return this._twilioService.client.messages.create({
	// 		to,
	// 		body,
	// 		messagingServiceSid: this._messagesConfig.twilioServiceSid,
	// 		...options
	// 	});
	// }

	async send(to: string, body: string, options?: any) {
		console.log(to, body, options);
	}
}

import type { IMessagesConfig } from "src/app/shared/messages";

import { environment } from "../../../environments/environment";

export const MESSAGES_CONFIG: IMessagesConfig = {
	twilioAccountSid: environment.twilioAccountSid,
	twilioAuthToken: environment.twilioAuthToken,
	twilioServiceSid: environment.twilioServiceSid
};

import type { IMailsConfig } from "src/app/shared/mails";

import { environment } from "../../../environments/environment";

export const MAILS_CONFIG: IMailsConfig = {
	gmailUser: environment.gmailUser,
	gmailPassword: environment.gmailPassword,
	from: "asd@asd.com" || environment.gmailUser
};

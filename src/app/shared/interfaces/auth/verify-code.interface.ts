import type { IUser } from "../users";

export interface IVerifyCode {
	verificationCode: IUser["verificationCode"];
}

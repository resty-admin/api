import type { IUser } from "../users";

interface IForgotPasswordWithTel {
	tel: IUser["tel"];
}

interface IForgotPasswordWithEmail {
	email: IUser["email"];
}

export type IForgotPassword = IForgotPasswordWithEmail | IForgotPasswordWithTel;

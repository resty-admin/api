import type { IUser } from "../users";

interface ISignUpBase {
	password: Required<IUser>["password"];
	role: IUser["role"];
}

interface ISignUpWithTel extends ISignUpBase {
	tel: IUser["tel"];
}

interface ISignUpWithEmail extends ISignUpBase {
	email: IUser["email"];
}

export type ISignUp = ISignUpWithEmail | ISignUpWithTel;

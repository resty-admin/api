import type { IUser } from "../users";

interface ISignInBase {
	password: Required<IUser>["password"];
}

interface ISignInWithTel extends ISignInBase {
	tel: IUser["tel"];
}

interface ISignInWithEmail extends ISignInBase {
	email: IUser["email"];
}

export type ISignIn = ISignInWithEmail | ISignInWithTel;

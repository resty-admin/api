import type { ThemeEnum, UserRoleEnum, UserStatusEnum } from "../../enums";

export interface IUser {
	id: string;
	name: string;
	role: UserRoleEnum;
	// language: ILanguage;
	theme: ThemeEnum;
	password?: string;
	email?: string;
	tel?: string;
	googleId?: string;
	telegramId?: number;
	verificationCode?: number;
	status: UserStatusEnum;
	// orders: IUserToOrder[];
	// products: IProductToOrder[];
	// tables: IUserToTable[];
}

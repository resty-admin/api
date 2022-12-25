import type { Request } from "express";

import type { IUser } from "./users";

export type IRequest = Request & {
	user: IUser;
};

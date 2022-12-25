import type { IUser } from "../users";
import type { IOrder } from "./order.interface";

export interface IUserToOrder {
	id: string;
	user: IUser;
	order: IOrder;
}

import type { OrderStatusEnum, OrderTypeEnum } from "../../enums";
import type { ITable } from "../tables";
import type { IProductToOrder } from "./product-to-order.interface";
import type { IUserToOrder } from "./user-to-order.interface";

export interface IOrder {
	id: string;
	name: string;
	type: OrderTypeEnum;
	status: OrderStatusEnum;
	users: IUserToOrder[];
	table: ITable;
	code: number;
	products: IProductToOrder[];
	address: string;
	date: number;
	sum: string;
	time: string;
	place: string;
}

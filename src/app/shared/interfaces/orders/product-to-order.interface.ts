import type { ProductToOrderStatusEnum } from "../../enums";
import type { IProduct } from "../products";
import type { IUser } from "../users";
import type { IOrder } from "./order.interface";

export interface IProductToOrder {
	id: string;
	product: IProduct;
	order: IOrder;
	user: IUser;
	quantity: number;
	status: ProductToOrderStatusEnum;
}

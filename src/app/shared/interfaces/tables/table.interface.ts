import type { IHall } from "../halls";
import type { ILayer } from "../layers";
import type { IOrder } from "../orders";
import type { IUserToTable } from "./user-to-table.interface";

export interface ITable {
	id: string;
	file: any;
	hall: IHall;
	waiters: IUserToTable[];
	code: number;
	name: string;
	orders: IOrder[];
	layer: ILayer;
}

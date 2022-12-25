import type { IUser } from "../users";
import type { ITable } from "./table.interface";

export interface IUserToTable {
	id: string;
	user: IUser;
	table: ITable;
}

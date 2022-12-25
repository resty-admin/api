import type { ICategory } from "../categories";
import type { IFile } from "../files";
import type { IProductToOrder } from "../orders";

export interface IProduct {
	id: string;
	name: string;
	image: string;
	description: string;
	price: number;
	category: ICategory;
	file: IFile;
	orders: IProductToOrder[];
}

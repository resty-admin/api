import type { IFile } from "../files";
import type { IProduct } from "../products";

export interface ICategory {
	id: string;
	name: string;
	image: string;
	products: IProduct[];
	file: IFile;
}

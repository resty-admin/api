import type { IFile } from "../files";
import type { ILayer } from "../layers";
import type { ITable } from "../tables";

export interface IHall {
	id: string;
	name: string;
	file: IFile;
	address: string;
	description: string;
	tables: ITable[];
	layers: ILayer[];
}

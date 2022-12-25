import type { ModelTypeEnum } from "../../enums";
import type { IFile } from "../files";

export interface IModel {
	id: string;
	file: IFile;
	width: number;
	height: number;
	name: string;
	type: ModelTypeEnum;
}

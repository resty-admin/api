import type { IFile } from "../files";

export interface ILanguage {
	id: string;
	name: string;
	file: IFile;
}

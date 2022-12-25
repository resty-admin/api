import { IFile } from "src/app/shared/interfaces";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateTableDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	// @ApiProperty()
	@IsOptional()
	file: IFile;
}

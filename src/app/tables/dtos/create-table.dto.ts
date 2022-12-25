import { IFile } from "src/app/shared/interfaces";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class CreateTableDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsString()
	@IsOptional()
	// @ApiProperty()
	hall: string;

	// @ApiProperty()
	@IsOptional()
	file: IFile;
}

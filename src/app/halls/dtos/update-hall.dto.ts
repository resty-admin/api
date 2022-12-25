import { IFile } from "src/app/shared/interfaces";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateHallDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	// @ApiProperty()
	@IsOptional()
	file: IFile;
}

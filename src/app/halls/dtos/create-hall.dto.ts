import { IFile } from "src/app/shared/interfaces";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class CreateHallDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	place: string;

	// @ApiProperty()
	@IsOptional()
	file: IFile;
}

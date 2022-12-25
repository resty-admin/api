import { IFile } from "src/app/shared/interfaces";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateCategoryDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	@IsOptional()
	name: string;

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	// @ApiProperty()
	place: string;

	// @ApiProperty()
	@IsOptional()
	file: IFile;
}

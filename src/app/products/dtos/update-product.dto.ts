import { IsNotEmpty, IsString } from "class-validator";
import { IFile } from "src/app/shared/interfaces";

import { IsNumber, IsOptional } from "../../shared";

export class UpdateProductDto {
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	// @ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	// @ApiProperty()
	category: string;

	@IsString()
	@IsOptional()
	// @ApiProperty()
	description: string;

	@IsNumber()
	@IsOptional()
	// @ApiProperty()
	price: number;

	// @ApiProperty()
	@IsOptional()
	file: IFile;
}

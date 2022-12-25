import { IsArray } from "class-validator";
import { IFile } from "src/app/shared/interfaces";

import { IsNotEmpty, IsNumber, IsOptional, IsString } from "../../shared";

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
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

	// @ApiProperty()
	@IsOptional()
	@IsArray()
	attrsGroups: string[];
}

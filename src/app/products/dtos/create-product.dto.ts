import { Field, InputType } from "@nestjs/graphql";
import { IsArray } from "class-validator";

import { FileEntity } from "../../files/entities";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "../../shared";
import { IFile } from "../../shared/interfaces";

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

@InputType()
export class CreateProductInput {
	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	name: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	category: string;

	@Field(() => String)
	@IsString()
	@IsOptional()
	description: string;

	@Field(() => Number)
	@IsNumber()
	@IsOptional()
	price: number;

	@Field(() => FileEntity, { nullable: true })
	@IsOptional()
	file?: IFile;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	attrsGroups: string[];
}

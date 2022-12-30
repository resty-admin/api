import { Field, InputType } from "@nestjs/graphql";
import { IsArray } from "class-validator";

import { FileUploadInput } from "../../files/dtos";
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
	name: string;

	@Field(() => String)
	category: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	description?: string;

	@Field(() => Number, { nullable: true })
	@IsOptional()
	price?: number;

	@Field(() => FileUploadInput, { nullable: true })
	@IsOptional()
	@IsOptional()
	file?: FileUploadInput;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	attrsGroups?: string[];
}

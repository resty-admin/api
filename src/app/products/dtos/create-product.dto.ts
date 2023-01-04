import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsArray } from "class-validator";

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

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Transform(({ value }) => ({ id: value }))
	file?: string;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	attrsGroups?: string[];
}

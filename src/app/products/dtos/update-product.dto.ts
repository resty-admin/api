import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

import { FileUploadInput } from "../../files/dtos";
import { IsNumber, IsOptional } from "../../shared";
import { IFile } from "../../shared/interfaces";

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

@InputType()
export class UpdateProductInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	category?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	description?: string;

	@Field(() => Number, { nullable: true })
	@IsOptional()
	price?: number;

	@Field(() => FileUploadInput, { nullable: true })
	@IsOptional()
	file?: FileUploadInput;
}

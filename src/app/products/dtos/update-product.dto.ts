import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

import { FileEntity } from "../../files/entities";
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
	name?: string;

	@Field(() => String, { nullable: true })
	category?: string;

	@Field(() => String, { nullable: true })
	description?: string;

	@Field(() => Number, { nullable: true })
	price?: number;

	@Field(() => FileEntity, { nullable: true })
	file?: IFile;
}

import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

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
	@IsUUID()
	id: string;

	@Field(() => String)
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	name: string;

	@Field(() => String)
	@IsString()
	@IsOptional()
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

}

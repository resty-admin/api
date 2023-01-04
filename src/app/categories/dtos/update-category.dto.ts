import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";
import { IFile } from "../../shared/interfaces";

export class UpdateCategoryDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	@IsOptional()
	name: string;

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	@ApiProperty()
	place: string;

	@ApiProperty()
	@IsOptional()
	file: IFile;
}

@InputType()
export class UpdateCategoryInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	place?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: string;
}

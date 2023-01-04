import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";
import { IFile } from "../../shared/interfaces";

export class CreateCategoryDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	place: string;

	@ApiProperty()
	@IsOptional()
	file: IFile;
}

@InputType()
export class CreateCategoryInput {
	@Field(() => String)
	name: string;

	@Field(() => String)
	place: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: string;
}

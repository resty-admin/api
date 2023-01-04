import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsOptional, IsString, MinLength } from "../../shared";
import { IFile } from "../../shared/interfaces";

export class CreateCompanyDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	// @ApiProperty()
	name: string;

	// @ApiProperty()
	@IsOptional()
	logo: IFile;
}

@InputType()
export class CreateCompanyInput {
	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Transform(({ value }) => ({ id: value }))
	logo?: string;
}

import { Field, InputType } from "@nestjs/graphql";

import { FileUploadInput } from "../../files/dtos";
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

	@Field(() => FileUploadInput, { nullable: true })
	@IsOptional()
	logo?: FileUploadInput;
}

import { Field, InputType } from "@nestjs/graphql";

import { FileEntity } from "../../files/entities";
import { IsNotEmpty, IsOptional, IsString } from "../../shared";
import { IFile } from "../../shared/interfaces";

export class UpdateCompanyDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	// @ApiProperty()
	@IsOptional()
	logo: IFile;

	// @ApiProperty()
	@IsOptional()
	@IsString()
	employees: string[];
}

@InputType()
export class UpdateCompanyInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => FileEntity, { nullable: true })
	@IsOptional()
	logo?: IFile;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	employees?: string[];
}

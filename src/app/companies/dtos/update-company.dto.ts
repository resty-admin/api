import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

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
	@IsUUID()
	id: string;

	@Field(() => String)
	@IsOptional()
	name: string;

	@Field(() => FileEntity, { nullable: true })
	@IsOptional()
	logo?: IFile;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	employees: string[];
}

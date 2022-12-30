import { Field, InputType } from "@nestjs/graphql";

import { FileEntity } from "../../files/entities";
import { IsNotEmpty, IsOptional, IsString } from "../../shared";
import { IFile } from "../../shared/interfaces";

export class CreateTableDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsString()
	@IsOptional()
	// @ApiProperty()
	hall: string;

	// @ApiProperty()
	@IsOptional()
	file: IFile;
}

@InputType()
export class CreateTableInput {
	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	hall?: string;

	@Field(() => FileEntity, { nullable: true })
	file?: IFile;
}

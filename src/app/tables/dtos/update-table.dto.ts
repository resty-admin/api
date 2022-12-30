import { Field, InputType } from "@nestjs/graphql";

import { FileEntity } from "../../files/entities";
import { IsNotEmpty, IsOptional, IsString } from "../../shared";
import { IFile } from "../../shared/interfaces";

export class UpdateTableDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	// @ApiProperty()
	@IsOptional()
	file: IFile;
}

@InputType()
export class UpdateTableInput {
	@Field(() => String)
	id: string;

	@Field(() => String)
	name: string;

	@Field(() => FileEntity, { nullable: true })
	file?: IFile;
}

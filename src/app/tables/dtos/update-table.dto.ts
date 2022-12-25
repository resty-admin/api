import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

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
	@IsUUID()
	id: string;

	@Field(() => String)
	@IsNotEmpty()
	name: string;

	@Field(() => FileEntity, { nullable: true })
	@IsOptional()
	file?: IFile;
}

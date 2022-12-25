import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import { IFile } from "src/app/shared/interfaces";

import { FileEntity } from "../../files/entities";
import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateHallDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsOptional()
	file: IFile;
}

@InputType()
export class UpdateHallInput {
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

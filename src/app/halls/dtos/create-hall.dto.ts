import { Field, InputType } from "@nestjs/graphql";
import { IFile } from "src/app/shared/interfaces";

import { FileEntity } from "../../files/entities";
import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class CreateHallDto {
	@IsString()
	@IsNotEmpty()
		// @ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
		// @ApiProperty()
	place: string;

	// @ApiProperty()
	@IsOptional()
	file: IFile;
}

@InputType()
export class CreateHallInput {
	@Field(() => String)
	@IsNotEmpty()
	name: string;

	@Field(() => String)
	@IsNotEmpty()
	place: string;

	@Field(() => FileEntity, { nullable: true })
	@IsOptional()
	file?: IFile;
}

import { Field, InputType } from "@nestjs/graphql";
import { IFile } from "src/app/shared/interfaces";

import { FileUploadInput } from "../../files/dtos";
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
	name: string;

	@Field(() => String)
	place: string;

	@Field(() => FileUploadInput, { nullable: true })
	@IsOptional()
	file?: FileUploadInput;
}

import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IFile } from "src/app/shared/interfaces";

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
	id: string;

	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: string;
}

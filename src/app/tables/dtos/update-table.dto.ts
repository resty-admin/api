import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateTableDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	// @ApiProperty()
	@IsOptional()
	file: string;
}

@InputType()
export class UpdateTableInput {
	@Field(() => String)
	id: string;

	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Transform(({ value }) => ({ id: value }))
	file?: string;
}

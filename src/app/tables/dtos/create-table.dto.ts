import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

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
	file: string;
}

@InputType()
export class CreateTableInput {
	@Field(() => String)
	name: string;

	@Field(() => String)
	hall: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Transform(({ value }) => ({ id: value }))
	file?: string;
}

import { Field, InputType, Int } from "@nestjs/graphql";
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

	@Field(() => Int, { nullable: true })
	@IsOptional()
	code?: number;

	@Field(() => String)
	hall: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: string;
}

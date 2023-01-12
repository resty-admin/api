import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsNumber, IsOptional, IsString } from "../../shared";

export class CreateAttributeDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsNumber()
	@IsOptional()
	// @ApiProperty()
	price: number;
}

@InputType()
export class CreateAttributeInput {
	@Field(() => String)
	@IsString()
	name: string;

	@Field(() => Int)
	@IsNumber()
	price: number;

	@Field(() => [String])
	@Transform(({ value }) => value.map((id) => ({ id })))
	attributesGroup: string[];
}

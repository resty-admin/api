import { Field, InputType, Int } from "@nestjs/graphql";

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
	name: string;

	@Field(() => Int)
	price: number;
}

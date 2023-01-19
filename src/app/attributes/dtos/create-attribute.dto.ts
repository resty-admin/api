import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsArray, IsNotEmpty, IsNumber, IsString } from "../../shared";

@InputType()
export class CreateAttributeInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => Int)
	@IsNumber()
	@IsNotEmpty()
	price: number;

	@Field(() => [String])
	@Transform(({ value }) => value.map((id) => ({ id })))
	@IsArray()
	@IsNotEmpty()
	attributesGroup: string[];
}

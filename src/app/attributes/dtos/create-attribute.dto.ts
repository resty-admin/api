import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsArray, IsNotEmpty, IsNumber, IsString } from "../../shared";
import type { InputEntity } from "../../shared/interfaces";

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

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	place: string;

	@Field(() => [String])
	@Transform(({ value }) => value.map((id) => ({ id })))
	@IsArray()
	@IsNotEmpty()
	attributesGroup: InputEntity[];
}

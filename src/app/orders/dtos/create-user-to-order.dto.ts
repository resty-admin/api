import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNumber, IsString } from "../../shared";

@InputType()
export class CreateUserToOrderInput {
	@Field(() => String)
	@IsString()
	@Transform(({ value }) => ({ id: value }))
	user: String;

	@Field(() => String)
	@IsString()
	@Transform(({ value }) => ({ id: value }))
	product: string;

	@Field(() => [String], { nullable: true })
	attributes?: string[];

	@Field(() => Int)
	@IsNumber()
	count: number;
}

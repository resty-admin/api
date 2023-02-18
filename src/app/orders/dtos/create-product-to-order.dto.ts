import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNumber } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

@InputType()
export class CreateProductToOrderInput {
	// @Field(() => String)
	// @Transform(({ value }) => ({ id: value }))
	// user: String;

	@Field(() => String)
	@Transform(({ value }) => ({ id: value }))
	productId: InputEntity;

	@Field(() => [String], { nullable: true })
	@Transform(({ value }) => value.map((id) => ({ id })))
	attributesIds?: InputEntity[];

	@Field(() => Int)
	@IsNumber()
	count: number;
}

import { Field, InputType } from "@nestjs/graphql";
import { IsNumber } from "class-validator";

import { IsOptional, IsString } from "../../shared";

@InputType()
export class ConfirmProductToOrderInput {
	@Field(() => String)
	@IsString()
	orderId: string;

	@Field(() => String)
	@IsString()
	productId: string;

	@Field(() => Number)
	@IsNumber()
	count: string;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	attributesIds?: string[];
}

import { Field, InputType } from "@nestjs/graphql";

import { IsOptional, IsString } from "../../shared";

@InputType()
export class AddProductToOrderInput {
	@Field(() => String)
	@IsString()
	orderId: string;

	@Field(() => String)
	@IsString()
	productId: string;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	attrs?: string[];
}

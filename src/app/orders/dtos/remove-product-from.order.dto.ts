import { Field, InputType } from "@nestjs/graphql";

import { IsOptional, IsString } from "../../shared";

@InputType()
export class RemoveProductFromOrderInput {
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

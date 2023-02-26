import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { OrderTypeEnum } from "src/app/shared/enums";

import { IsEnum, IsOptional } from "../../shared";
import { InputEntity } from "../../shared/interfaces";
import { CreateProductToOrderInput } from "./create-product-to-order.dto";

@InputType()
export class CreateOrderInput {
	@Field(() => OrderTypeEnum)
	@IsEnum(OrderTypeEnum)
	type: OrderTypeEnum;

	@Field(() => String)
	@Transform(({ value }) => ({ id: value }))
	place: InputEntity;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	table?: InputEntity;

	@Field(() => [CreateProductToOrderInput], { nullable: true })
	productsToOrder?: CreateProductToOrderInput[];

	@Field(() => String, { nullable: true })
	@IsOptional()
	comments?: string;
}

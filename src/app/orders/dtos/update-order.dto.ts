import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { OrderStatusEnum, OrderTypeEnum } from "src/app/shared/enums";

import { IsEnum, IsOptional } from "../../shared";

@InputType()
export class UpdateOrderInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	table?: string;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@Transform(({ value }) => value.map((id) => ({ id })))
	users?: string[];

	@Field(() => OrderStatusEnum, { nullable: true })
	@IsOptional()
	status?: OrderStatusEnum;

	@Field(() => OrderTypeEnum, { nullable: true })
	@IsOptional()
	@IsEnum(OrderTypeEnum)
	type?: OrderTypeEnum;
}

import { Field, InputType } from "@nestjs/graphql";
import { OrderStatusEnum, OrderTypeEnum } from "src/app/shared/enums";

import { IsEnum, IsNotEmpty, IsOptional } from "../../shared";

export class UpdateOrderDto {
	@IsEnum(OrderTypeEnum)
	@IsNotEmpty()
	@IsOptional()
	// @ApiProperty()
	type: OrderTypeEnum;
}

@InputType()
export class UpdateOrderInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	table?: string;

	@Field(() => [String], { nullable: true })
	users?: string[];

	@Field(() => OrderStatusEnum, { nullable: true })
	status?: OrderStatusEnum;

	@Field(() => OrderTypeEnum, { nullable: true })
	@IsEnum(OrderTypeEnum)
	type?: OrderTypeEnum;
}

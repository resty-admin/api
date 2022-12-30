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
	@IsOptional()
	table?: string;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	users?: string[];

	@Field(() => OrderStatusEnum, { nullable: true })
	@IsOptional()
	status?: OrderStatusEnum;

	@Field(() => OrderTypeEnum, { nullable: true })
	@IsOptional()
	@IsEnum(OrderTypeEnum)
	type?: OrderTypeEnum;
}

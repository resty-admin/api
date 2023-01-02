import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { OrderStatusEnum, OrderTypeEnum } from "src/app/shared/enums";

import { IsEnum, IsNotEmpty, IsOptional } from "../../shared";
import { CreateUserToOrderInput } from "./create-user-to-order.dto";

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

	// @Field(() => [String], { nullable: true })
	// @IsOptional()
	// users?: string[];

	@Field(() => OrderStatusEnum, { nullable: true })
	@IsOptional()
	status?: OrderStatusEnum;

	@Field(() => OrderTypeEnum, { nullable: true })
	@IsOptional()
	@IsEnum(OrderTypeEnum)
	type?: OrderTypeEnum;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	totalPrice?: number;

	@Field(() => [CreateUserToOrderInput], { nullable: true })
	@Transform(({ value }) =>
		value.map((el) => ({
			...el,
			user: { id: el.user },
			product: { id: el.product },
			attributes: el.attributes?.map((el) => ({ id: el })) || null
		}))
	)
	usersToOrders?: CreateUserToOrderInput[];
}

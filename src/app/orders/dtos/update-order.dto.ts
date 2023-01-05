import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
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

	// @Field(() => Int, { nullable: true })
	// @IsOptional()
	// totalPrice?: number;

	// @Field(() => [UpdateUserToOrderInput], { nullable: true })
	// @Transform(({ value }) =>
	// 	value.map((el) => ({
	// 		...el,
	// 		...(el.id ? { id: el.id } : {}),
	// 		user: { id: el.user },
	// 		product: { id: el.product },
	// 		attributes: el.attributes?.map((el) => ({ id: el })) || null
	// 	}))
	// )
	// usersToOrders?: UpdateUserToOrderInput[];
}

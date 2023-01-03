import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { OrderTypeEnum } from "src/app/shared/enums";

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "../../shared";

export class CreateOrderDto {
	@IsEnum(OrderTypeEnum)
	@IsNotEmpty()
	// @ApiProperty()
	type: OrderTypeEnum;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	place: string;

	@IsNumber()
	@IsNotEmpty()
	totalPrice: number;
}

@InputType()
export class CreateOrderInput {
	@Field(() => OrderTypeEnum)
	@IsEnum(OrderTypeEnum)
	type: OrderTypeEnum;

	@Field(() => String)
	@Transform(({ value }) => ({ id: value }))
	place: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	table?: string;

	@Field(() => Int)
	totalPrice: number;

	@Field(() => [String], { nullable: true })
	@Transform(({ value }) => value.map((id) => ({ id })))
	users?: string[];
	// @Field(() => [CreateUserToOrderInput], { nullable: true })
	// @Transform(({ value }) =>
	// 	value.map((el) => ({
	// 		...el,
	// 		user: { id: el.user },
	// 		product: { id: el.product },
	// 		attributes: el.attributes?.map((el) => ({ id: el })) || null
	// 	}))
	// )
	// usersToOrders?: CreateUserToOrderInput[];
}

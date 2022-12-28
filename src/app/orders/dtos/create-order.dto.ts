import { Field, InputType, Int } from "@nestjs/graphql";
import { OrderTypeEnum } from "src/app/shared/enums";

import { IsEnum, IsNotEmpty, IsNumber, IsString } from "../../shared";

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
	@IsNotEmpty()
	type: OrderTypeEnum;

	@Field(() => String)
	@IsNotEmpty()
	place: string;

	@Field(() => Int)
	@IsNumber()
	@IsNotEmpty()
	totalPrice: number;
}

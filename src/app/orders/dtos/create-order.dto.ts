import { Field, InputType, Int } from "@nestjs/graphql";
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
	place: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	table?: string;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	users?: string[];

	@Field(() => Int)
	totalPrice: number;
}

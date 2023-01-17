import { Field, InputType } from "@nestjs/graphql";
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

	@Field(() => String, { nullable: true })
	@IsOptional()
	comments?: string;
}

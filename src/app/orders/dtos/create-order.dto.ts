import { Field, InputType } from "@nestjs/graphql";
import { OrderTypeEnum } from "src/app/shared/enums";

import { IsEnum, IsNotEmpty, IsString } from "../../shared";

export class CreateOrderDto {
	@IsEnum(OrderTypeEnum)
	@IsNotEmpty()
	// @ApiProperty()
	type: OrderTypeEnum;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	place: string;
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
}

import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import { OrderTypeEnum } from "src/app/shared/enums";

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
	@IsUUID()
	id: string;

	@Field(() => OrderTypeEnum)
	@IsEnum(OrderTypeEnum)
	@IsOptional()
	type: OrderTypeEnum;
}

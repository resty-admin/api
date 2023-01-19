import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { OrderTypeEnum } from "src/app/shared/enums";

import { IsEnum, IsOptional } from "../../shared";

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

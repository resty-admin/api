import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { OrderTypeEnum } from "src/app/shared/enums";

import { IsEnum, IsOptional } from "../../shared";

@InputType()
export class UpdateOrderInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	table?: string;

	startDate?: string;

	@Field(() => OrderTypeEnum, { nullable: true })
	@IsOptional()
	@IsEnum(OrderTypeEnum)
	type?: OrderTypeEnum;
}

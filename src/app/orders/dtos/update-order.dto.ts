import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { OrderTypeEnum } from "src/app/shared/enums";

import { IsDate, IsEnum, IsOptional } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

@InputType()
export class UpdateOrderInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	table?: InputEntity;

	@Field(() => Date, { nullable: true })
	@IsOptional()
	@IsDate()
	startDate?: string;

	@Field(() => OrderTypeEnum, { nullable: true })
	@IsOptional()
	@IsEnum(OrderTypeEnum)
	type?: OrderTypeEnum;
}

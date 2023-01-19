import { Field, InputType, Int } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "../../shared";
import { AttributeGroupTypeEnum } from "../../shared/enums";

@InputType()
export class UpdateAttributeGroupInput {
	@Field(() => String)
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => Boolean, { nullable: true })
	@IsOptional()
	isUniq?: boolean;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	attributes?: string[];

	@Field(() => AttributeGroupTypeEnum, { nullable: true })
	@IsEnum(AttributeGroupTypeEnum)
	@IsOptional()
	type?: AttributeGroupTypeEnum;

	@Field(() => Int, { nullable: true })
	@IsNumber()
	@IsOptional()
	maxItemsForPick?: number;
}

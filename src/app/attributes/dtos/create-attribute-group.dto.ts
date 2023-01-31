import { Field, InputType, Int } from "@nestjs/graphql";

import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "../../shared";
import { AttributeGroupTypeEnum } from "../../shared/enums";

@InputType()
export class CreateAttributeGroupInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	place: string;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	attributes?: string[];

	@Field(() => AttributeGroupTypeEnum)
	@IsEnum(AttributeGroupTypeEnum)
	@IsNotEmpty()
	type: AttributeGroupTypeEnum;

	@Field(() => Int)
	@IsNumber()
	@IsNotEmpty()
	maxItemsForPick: number;
}

import { Field, InputType, Int } from "@nestjs/graphql";

import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "../../shared";
import { AttributeGroupTypeEnum } from "../../shared/enums";

export class CreateAttributeGroupDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsString()
	// @ApiProperty()
	@IsNotEmpty()
	place: string;

	@IsOptional()
	@IsArray()
	attributes?: string[];

	@IsEnum(AttributeGroupTypeEnum)
	type: AttributeGroupTypeEnum;

	@IsNumber()
	maxItemsForPick: number;
}

@InputType()
export class CreateAttributeGroupInput {
	@Field(() => String)
	@IsString()
	name: string;

	@Field(() => String)
	@IsString()
	place: string;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	attributes?: string[];

	@Field(() => AttributeGroupTypeEnum)
	@IsEnum(AttributeGroupTypeEnum)
	type: AttributeGroupTypeEnum;

	@Field(() => Int)
	@IsNumber()
	maxItemsForPick: number;
}

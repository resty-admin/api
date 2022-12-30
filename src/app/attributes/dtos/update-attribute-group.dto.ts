import { Field, InputType, Int } from "@nestjs/graphql";
import { IsBoolean, IsUUID } from "class-validator";

import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "../../shared";
import { AttributeGroupTypeEnum } from "../../shared/enums";

export class UpdateAttributeGroupDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsBoolean()
	@IsOptional()
	// @ApiProperty()
	isUniq: boolean;

	@IsOptional()
	@IsArray()
	attributes?: string[];
}

@InputType()
export class UpdateAttributeGroupInput {
	@Field(() => String)
	@IsUUID()
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => Boolean, { nullable: true })
	@IsOptional()
	isUniq?: boolean;

	@Field(() => [String], { nullable: true })
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

import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsUUID } from "class-validator";

import { IsArray, IsNotEmpty, IsOptional, IsString } from "../../shared";

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
}

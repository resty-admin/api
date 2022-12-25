import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean } from "class-validator";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class CreateAttributeGroupDto {
	@IsString()
	@IsNotEmpty()
		// @ApiProperty()
	name: string;

	@IsBoolean()
	@IsOptional()
		// @ApiProperty()
	isUniq: boolean;

	@IsString()
	// @ApiProperty()
	@IsNotEmpty()
	place: string;
}

@InputType()
export class CreateAttributeGroupInput {
	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	name: string;

	@Field(() => Boolean)
	@IsBoolean()
	@IsOptional()
	isUniq: boolean;

	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	place: string;
}

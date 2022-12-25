import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsUUID } from "class-validator";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateAttributeGroupDto {
	@IsString()
	@IsNotEmpty()
		// @ApiProperty()
	name: string;

	@IsBoolean()
	@IsOptional()
		// @ApiProperty()
	isUniq: boolean;
}

@InputType()
export class UpdateAttributeGroupInput {
	@Field(() => String)
	@IsUUID()
	id: string;

	@Field(() => String)
	@IsOptional()
	@IsString()
	name: string;

	@Field(() => Boolean)
	@IsBoolean()
	@IsOptional()
	isUniq: boolean;

}

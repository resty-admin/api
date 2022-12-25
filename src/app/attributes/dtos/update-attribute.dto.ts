import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

import { IsNotEmpty, IsString } from "../../shared";

export class UpdateAttributeDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;
}

@InputType()
export class UpdateAttributeInput {
	@Field(() => String)
	@IsUUID()
	id: string;

	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	name: string;
}

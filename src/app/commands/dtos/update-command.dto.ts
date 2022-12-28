import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

import { IsNotEmpty, IsString } from "../../shared";

export class UpdateCommandDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;
}

@InputType()
export class UpdateCommandInput {
	@Field(() => String)
	@IsUUID()
	id: string;

	@Field(() => String)
	@IsNotEmpty()
	name: string;
}

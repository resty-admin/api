import { Field, InputType } from "@nestjs/graphql";

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
	id: string;

	@Field(() => String)
	name: string;
}

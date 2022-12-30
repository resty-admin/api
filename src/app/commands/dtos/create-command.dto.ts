import { Field, InputType } from "@nestjs/graphql";

import { IsNotEmpty, IsString } from "../../shared";

export class CreateCommandDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
	place: string;

	@IsString()
	description: string;
}

@InputType()
export class CreateCommandInput {
	@Field(() => String)
	name: string;

	@Field(() => String)
	place: string;

	@Field(() => String)
	description: string;
}

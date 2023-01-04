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
	@IsString()
	name: string;

	@Field(() => String)
	@IsString()
	place: string;

	@Field(() => String)
	@IsString()
	description: string;
}

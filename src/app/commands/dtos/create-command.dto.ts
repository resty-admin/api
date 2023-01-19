import { Field, InputType } from "@nestjs/graphql";

import { IsString } from "../../shared";

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

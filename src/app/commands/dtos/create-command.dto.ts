import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsString } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

@InputType()
export class CreateCommandInput {
	@Field(() => String)
	@IsString()
	name: string;

	@Field(() => String)
	@IsString()
	@Transform(({ value }) => ({ id: value }))
	@IsNotEmpty()
	place: InputEntity;

	@Field(() => String)
	@IsString()
	description: string;
}

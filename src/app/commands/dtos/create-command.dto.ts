import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

@InputType()
export class CreateCommandInput {
	@Field(() => String)
	@IsString()
	name: string;

	@Field(() => String)
	@Transform(({ value }) => ({ id: value }))
	@IsNotEmpty()
	place: InputEntity;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	description?: string;
}

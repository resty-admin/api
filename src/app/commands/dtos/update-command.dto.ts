import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsOptional, IsString } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

@InputType()
export class UpdateCommandInput {
	@Field(() => String)
	@IsString()
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@Transform(({ value }) => ({ id: value }))
	@IsOptional()
	place?: InputEntity;

	@Field(() => String, { nullable: true })
	@IsOptional()
	description?: string;
}

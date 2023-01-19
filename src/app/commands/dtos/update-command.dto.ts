import { Field, InputType } from "@nestjs/graphql";

import { IsOptional, IsString } from "../../shared";

@InputType()
export class UpdateCommandInput {
	@Field(() => String)
	@IsString()
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	place?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	description?: string;
}

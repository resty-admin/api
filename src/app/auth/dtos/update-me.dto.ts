import { Field, InputType } from "@nestjs/graphql";

import { IsOptional } from "../../shared";

@InputType()
export class UpdateMeInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	email?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	tel?: string;
}

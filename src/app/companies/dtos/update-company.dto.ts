import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsUUID } from "class-validator";

import { IsNotEmpty, IsOptional } from "../../shared";

@InputType()
export class UpdateCompanyInput {
	@Field(() => String)
	@IsNotEmpty()
	@IsUUID()
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	logo?: string;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	employees?: string[];
}

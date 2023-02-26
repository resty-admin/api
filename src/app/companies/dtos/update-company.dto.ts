import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsUUID } from "class-validator";

import { IsNotEmpty, IsOptional } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

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
	logo?: InputEntity;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	employees?: string[];
}

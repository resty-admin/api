import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsUUID } from "class-validator";

import { IsNotEmpty, IsOptional } from "../../shared";

@InputType()
export class UpdateCategoryInput {
	@Field(() => String)
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	place?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: string;
}

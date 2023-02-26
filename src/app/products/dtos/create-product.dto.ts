import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

@InputType()
export class CreateProductInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	category: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	description?: string;

	@Field(() => Number, { nullable: true })
	@IsOptional()
	price?: number;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: InputEntity;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	attrsGroups?: string[];
}

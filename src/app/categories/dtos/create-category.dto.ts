import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

@InputType()
export class CreateCategoryInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	place: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: InputEntity;
}

import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNumber, IsOptional, IsString } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

@InputType()
export class UpdateUserToOrderInput {
	@Field(() => String)
	@IsOptional()
	id: string;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	user?: InputEntity;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	product?: InputEntity;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	attributes?: string[];

	@Field(() => Int, { nullable: true })
	@IsNumber()
	@IsOptional()
	count?: number;
}

import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

import { IsNotEmpty, IsObject, IsOptional, IsString } from "../../shared";

@InputType()
export class UpdateAccountingSystemInput {
	@Field(() => String)
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	name?: string;

	@Field(() => GraphQLJSONObject, { nullable: true })
	@IsObject()
	@IsOptional()
	configFields?: object;
}

import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

import { IsNotEmpty, IsObject, IsString } from "../../shared";

@InputType()
export class CreateAccountingSystemInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => GraphQLJSONObject, { nullable: true })
	@IsObject()
	configFields?: object;
}

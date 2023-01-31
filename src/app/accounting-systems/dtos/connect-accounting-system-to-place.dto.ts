import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { GraphQLJSONObject } from "graphql-type-json";

import { IsObject } from "../../shared";

@InputType()
export class ConnectAccountingSystemToPlaceInput {
	@Field(() => String)
	@Transform(({ value }) => ({ id: value }))
	place: string;

	@Field(() => String)
	@Transform(({ value }) => ({ id: value }))
	accountingSystem: string;

	@Field(() => GraphQLJSONObject)
	@IsObject()
	placeConfigFields: object;
}

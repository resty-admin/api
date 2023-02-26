import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { GraphQLJSONObject } from "graphql-type-json";

import { IsObject } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

@InputType()
export class ConnectAccountingSystemToPlaceInput {
	@Field(() => String)
	@Transform(({ value }) => ({ id: value }))
	place: InputEntity;

	@Field(() => String)
	@Transform(({ value }) => ({ id: value }))
	accountingSystem: InputEntity;

	@Field(() => GraphQLJSONObject)
	@IsObject()
	placeConfigFields: object;
}

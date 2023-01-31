import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { GraphQLJSONObject } from "graphql-type-json";

import { IsObject } from "../../shared";

@InputType()
export class ConnectPaymentSystemToPlaceInput {
	@Field(() => String)
	@Transform(({ value }) => ({ id: value }))
	place: string;

	@Field(() => String)
	@Transform(({ value }) => ({ id: value }))
	paymentSystem: string;

	@Field(() => GraphQLJSONObject)
	@IsObject()
	placeConfigFields: object;
}

import { Field, ObjectType } from "@nestjs/graphql";

import { ACCESS_TOKEN } from "../../shared/constants";

@ObjectType()
export class AccessToken {
	@Field(() => String)
	[ACCESS_TOKEN]: string;
}

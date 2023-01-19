import { Field, InputType } from "@nestjs/graphql";

import { IsNotEmpty, IsString } from "../../shared";

@InputType()
export class CreateAccountingSystemInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;
}

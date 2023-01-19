import { Field, InputType } from "@nestjs/graphql";

import { IsNotEmpty, IsString } from "../../shared";

@InputType()
export class CreatePaymentSystemInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;
}

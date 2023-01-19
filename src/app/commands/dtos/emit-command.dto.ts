import { Field, InputType } from "@nestjs/graphql";

import { IsNotEmpty } from "../../shared";

@InputType()
export class EmitCommandInput {
	@Field(() => String)
	@IsNotEmpty()
	command: string;

	@Field(() => String)
	@IsNotEmpty()
	table: string;
}

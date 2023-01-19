import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

import { IsNotEmpty, IsString } from "../../shared";

@InputType()
export class UpdateAccountingSystemInput {
	@Field(() => String)
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;
}

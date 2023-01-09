import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType()
export class AddEmployeeInput {
	@Field(() => String)
	@IsUUID()
	placeId: string;

	@Field(() => String)
	@IsUUID()
	userId: string;
}

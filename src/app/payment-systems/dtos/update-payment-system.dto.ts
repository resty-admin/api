import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdatePaymentSystemInput {
	@Field(() => String)
	id: string;

	@Field(() => String)
	name: string;
}

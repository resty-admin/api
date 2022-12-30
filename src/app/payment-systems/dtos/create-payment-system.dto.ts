import { Field, InputType } from "@nestjs/graphql";

import { IsNotEmpty, IsString } from "../../shared";

export class CreatePaymentSystemDto {
	@IsNotEmpty()
	// @ApiProperty()
	@IsString()
	name: string;
}

@InputType()
export class CreatePaymentSystemInput {
	@Field(() => String)
	name: string;
}

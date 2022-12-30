import { Field, InputType } from "@nestjs/graphql";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdatePaymentSystemDto {
	@IsNotEmpty()
	// @ApiProperty()
	@IsString()
	@IsOptional()
	name: string;
}

@InputType()
export class UpdatePaymentSystemInput {
	@Field(() => String)
	id: string;

	@Field(() => String)
	name: string;
}

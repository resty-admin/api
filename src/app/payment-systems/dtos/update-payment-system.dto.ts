import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

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
	@IsUUID()
	id: string;

	@Field(() => String)
	@IsNotEmpty()
	name: string;
}

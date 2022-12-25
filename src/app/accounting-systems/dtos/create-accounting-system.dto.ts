import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString } from "../../shared";

export class CreateAccountingSystemDto {
	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	name: string;
}

@InputType()
export class CreateAccountingSystemInput {
	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	name: string;
}

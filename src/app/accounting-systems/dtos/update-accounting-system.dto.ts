import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateAccountingSystemDto {
	@IsNotEmpty()
	@ApiProperty()
	@IsString()
	@IsOptional()
	name: string;
}

@InputType()
export class UpdateAccountingSystemInput {
	@Field(() => String)
	@IsUUID()
	id: string;

	@Field(() => String)
	name: string;
}

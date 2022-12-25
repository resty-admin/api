import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";
import {IsUUID} from "class-validator";

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
	@IsOptional()
	@IsString()
	name: string;
}

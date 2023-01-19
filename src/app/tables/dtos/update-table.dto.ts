import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsUUID } from "class-validator";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

@InputType()
export class UpdateTableInput {
	@Field(() => String)
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	code?: number;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: string;
}

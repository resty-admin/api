import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsUUID } from "class-validator";

import { IsNotEmpty, IsOptional } from "../../shared";

@InputType()
export class UpdateShiftInput {
	@Field(() => String)
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => [String], { nullable: true })
	@Transform(({ value }) => value.map((id) => ({ id })))
	@IsOptional()
	tables?: string[];
}

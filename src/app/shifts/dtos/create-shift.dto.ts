import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsOptional } from "../../shared";
import type { InputEntity } from "../../shared/interfaces";

@InputType()
export class CreateShiftInput {
	@Field(() => [String])
	@IsOptional()
	@Transform(({ value }) => value.map((id) => ({ id })))
	tables: InputEntity[];

	@Field(() => String, { nullable: true })
	@IsOptional()
	place?: string;
}

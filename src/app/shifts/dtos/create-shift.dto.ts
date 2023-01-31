import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsOptional } from "../../shared";

@InputType()
export class CreateShiftInput {
	@Field(() => [String])
	@IsOptional()
	@Transform(({ value }) => value.map((id) => ({ id })))
	tables: string[];

	@Field(() => String, { nullable: true })
	@IsOptional()
	place?: string;
}

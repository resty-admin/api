import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";
import { InputEntity } from "../../shared/interfaces";

@InputType()
export class CreateCompanyInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	logo?: InputEntity;
}

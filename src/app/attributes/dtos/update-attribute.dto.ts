import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsUUID } from "class-validator";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateAttributeDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;
}

@InputType()
export class UpdateAttributeInput {
	@Field(() => String)
	@IsUUID()
	id: string;

	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	name: string;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	price?: number;

	@Field(() => [String])
	@Transform(({ value }) => value.map((id) => ({ id })))
	attributesGroup: string[];
}

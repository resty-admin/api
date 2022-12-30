import { Field, InputType } from "@nestjs/graphql";

import { IsOptional, IsString } from "../../shared";

export class UpdateCommandDto {
	@IsString()
	@IsOptional()
	// @ApiProperty()
	name?: string;

	@IsString()
	@IsOptional()
	place?: string;

	@IsString()
	@IsOptional()
	description?: string;
}

@InputType()
export class UpdateCommandInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	place?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	description?: string;
}

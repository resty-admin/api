import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsUUID } from "class-validator";

import { FileUploadInput } from "../../files/dtos";
import { IsNotEmpty, IsOptional } from "../../shared";

@InputType()
export class UpdateProductInput {
	@Field(() => String)
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	category?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	description?: string;

	@Field(() => Number, { nullable: true })
	@IsOptional()
	price?: number;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: FileUploadInput;

	@Field(() => [String], { nullable: true })
	@Transform(({ value }) => value.map((id) => ({ id })))
	@IsOptional()
	attrsGroups?: string[];
}

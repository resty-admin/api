import { Field, InputType } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsISO8601 } from "class-validator";

import { IsOptional, IsString } from "../../shared";

export class UpdateShiftDto {
	// @ApiProperty()
	@IsOptional()
	@IsString()
	waiter: string;

	// @ApiProperty()
	@IsOptional()
	@IsString()
	table: string;

	// @ApiProperty()
	@IsOptional()
	@IsString()
	place: string;

	// @ApiProperty()
	// @IsArray()
	// @IsOptional()
	// commands: string[];

	// @ApiProperty()
	@IsOptional()
	@IsISO8601()
	shiftDate: string;
}

@InputType()
export class UpdateShiftInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@Transform(({ value }) => value.map((id) => ({ id })))
	@IsOptional()
	tables?: string;
}

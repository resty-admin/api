import { Field, InputType } from "@nestjs/graphql";
import { IsISO8601, IsUUID } from "class-validator";

import { IsArray, IsOptional, IsString } from "../../shared";

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
	@IsArray()
	@IsOptional()
	orders: string[];

	// @ApiProperty()
	@IsOptional()
	@IsISO8601()
	shiftDate: string;
}

@InputType()
export class UpdateShitInput {
	@Field(() => String)
	@IsUUID()
	id: string;

	@Field(() => String)
	@IsOptional()
	waiter: string;

	@Field(() => String)
	@IsOptional()
	@IsString()
	table: string;

	@Field(() => String)
	@IsOptional()
	@IsString()
	place: string;

	@Field(() => [String])
	@IsArray()
	@IsOptional()
	orders: string[];

	@Field(() => [String])
	@IsOptional()
	@IsISO8601()
	shiftDate: string;
}

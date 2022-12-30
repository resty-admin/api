import { Field, InputType } from "@nestjs/graphql";
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
	// orders: string[];

	// @ApiProperty()
	@IsOptional()
	@IsISO8601()
	shiftDate: string;
}

@InputType()
export class UpdateShitInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	waiter?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	table?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	place?: string;

	// @Field(() => [String])
	// @IsArray()
	// @IsOptional()
	// orders: string[];

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsISO8601()
	shiftDate?: string;
}

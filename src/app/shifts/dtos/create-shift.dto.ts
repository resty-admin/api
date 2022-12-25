import { IsISO8601 } from "class-validator";

import { IsArray, IsOptional, IsString } from "../../shared";

export class CreateShiftDto {
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

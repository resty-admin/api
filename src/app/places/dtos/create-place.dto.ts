import { Field, InputType } from "@nestjs/graphql";
import { Transform, Type } from "class-transformer";
import { isISO8601, ValidateNested } from "class-validator";

import { IsNotEmpty, IsObject, IsOptional, IsString } from "../../shared";
import { IsMap } from "../../shared/validators/is-map.validator";
import { WorkingHoursDto, WorkingHoursInput } from "./date-types.dto";

export class CreatePlaceDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	address: string;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	company: string;

	// @ApiProperty()
	@IsOptional()
	file: string;

	@IsObject()
	@IsOptional()
	@ValidateNested()
	@Type(() => WorkingHoursDto)
	weekDays: WorkingHoursDto;

	@IsObject()
	@IsOptional()
	@ValidateNested()
	@Type(() => WorkingHoursDto)
	weekendDays: WorkingHoursDto;

	// @ApiProperty()
	@IsOptional()
	@IsMap([isISO8601], [])
	@ValidateNested()
	@Type(() => WorkingHoursDto)
	holidayDays: Map<Date, WorkingHoursDto>;
}

@InputType()
export class CreatePlaceInput {
	@Field(() => String)
	name: string;

	@Field(() => String, { nullable: true })
	// @IsOptional()
	address?: string;

	@Field(() => String)
	company: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: string;

	@Field(() => WorkingHoursInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	weekDays?: WorkingHoursDto;

	@Field(() => WorkingHoursInput, { nullable: true })
	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	weekendDays?: WorkingHoursInput;

	@Field(() => WorkingHoursInput, { nullable: true })
	@IsOptional()
	@IsMap([isISO8601], [])
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	holidayDays?: Map<Date, WorkingHoursInput>;
}

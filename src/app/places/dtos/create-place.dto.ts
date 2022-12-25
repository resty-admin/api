import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { isISO8601, ValidateNested } from "class-validator";
import { IFile } from "src/app/shared/interfaces";

import { FileEntity } from "../../files/entities";
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
	file: IFile;

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
	@IsNotEmpty()
	@IsString()
	name: string;

	@Field(() => String)
	@IsString()
	@IsOptional()
	address: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	company: string;

	@Field(() => FileEntity)
	@IsOptional()
	file: IFile;

	@Field(() => WorkingHoursInput)
	@IsObject()
	@IsOptional()
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	weekDays: WorkingHoursDto;

	@Field(() => WorkingHoursInput)
	@IsObject()
	@IsOptional()
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	weekendDays: WorkingHoursInput;

	@Field(() => WorkingHoursInput)
	@IsOptional()
	@IsMap([isISO8601], [])
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	holidayDays: Map<Date, WorkingHoursInput>;
}

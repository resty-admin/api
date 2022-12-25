import { Type } from "class-transformer";
import { isISO8601, ValidateNested } from "class-validator";
import { IFile } from "src/app/shared/interfaces";

import { IsNotEmpty, IsObject, IsOptional, IsString } from "../../shared";
import { IsMap } from "../../shared/validators/is-map.validator";
import { WorkingHoursDto } from "./date-types.dto";

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

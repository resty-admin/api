import { Type } from "class-transformer";
import { isISO8601, ValidateNested } from "class-validator";
import { PlaceStatusEnum } from "src/app/shared/enums";
import { IFile } from "src/app/shared/interfaces";

import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "../../shared";
import { IsMap } from "../../shared/validators/is-map.validator";
import { WorkingHoursDto } from "./date-types.dto";

export class UpdatePlaceDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	@IsOptional()
	name: string;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	@IsOptional()
	address: string;

	@IsEnum(PlaceStatusEnum)
	@IsNotEmpty()
	// @ApiProperty()
	@IsOptional()
	status: PlaceStatusEnum;

	@IsOptional()
	// @ApiProperty()
	file: IFile;

	@IsOptional()
	@IsString()
	// @ApiProperty()
	a11y: string;

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

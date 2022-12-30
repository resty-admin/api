import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { isISO8601, ValidateNested } from "class-validator";
import { PlaceStatusEnum } from "src/app/shared/enums";
import { IFile } from "src/app/shared/interfaces";

import { FileEntity } from "../../files/entities";
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "../../shared";
import { IsMap } from "../../shared/validators/is-map.validator";
import { WorkingHoursDto, WorkingHoursInput } from "./date-types.dto";

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

@InputType()
export class UpdatePlaceInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	name?: string;

	@Field(() => String, { nullable: true })
	address?: string;

	@Field(() => FileEntity, { nullable: true })
	file?: IFile;

	@Field(() => WorkingHoursInput, { nullable: true })
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	weekDays?: WorkingHoursInput;

	@Field(() => WorkingHoursInput, { nullable: true })
	@IsObject()
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	weekendDays?: WorkingHoursInput;

	@Field(() => WorkingHoursInput, { nullable: true })
	@IsMap([isISO8601], [])
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	holidayDays?: Map<Date, WorkingHoursInput>;
}

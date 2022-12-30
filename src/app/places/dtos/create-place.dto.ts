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
	name: string;

	@Field(() => String, { nullable: true })
	address?: string;

	@Field(() => String)
	company: string;

	@Field(() => FileEntity, { nullable: true })
	file?: IFile;

	@Field(() => WorkingHoursInput, { nullable: true })
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	weekDays?: WorkingHoursDto;

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

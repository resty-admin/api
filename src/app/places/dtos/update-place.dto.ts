import { Field, InputType } from "@nestjs/graphql";
import { Transform, Type } from "class-transformer";
import { isISO8601, ValidateNested } from "class-validator";

import { IsObject, IsOptional } from "../../shared";
import { IsMap } from "../../shared/validators/is-map.validator";
import { WorkingHoursInput } from "./date-types.dto";

@InputType()
export class UpdatePlaceInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	address?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: string;

	@Field(() => WorkingHoursInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	weekDays?: WorkingHoursInput;

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

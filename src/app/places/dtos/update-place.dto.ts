import { Field, InputType } from "@nestjs/graphql";
import { Transform, Type } from "class-transformer";
import { isISO8601, ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

import { IsObject, IsOptional } from "../../shared";
import { InputEntity } from "../../shared/interfaces";
import { IsMap } from "../../shared/validators/is-map.validator";
import { WorkingHoursDto, WorkingHoursInput } from "./date-types.dto";

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
	file?: InputEntity;

	@Field(() => WorkingHoursDto, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => WorkingHoursDto)
	weekDays?: WorkingHoursDto;

	@Field(() => WorkingHoursDto, { nullable: true })
	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => WorkingHoursDto)
	weekendDays?: WorkingHoursDto;

	@Field(() => WorkingHoursInput, { nullable: true })
	@IsOptional()
	@IsMap([isISO8601], [])
	@ValidateNested()
	@Type(() => WorkingHoursInput)
	holidayDays?: Map<Date, WorkingHoursInput>;

	@Field(() => GraphQLJSONObject, { nullable: true })
	@IsObject()
	@IsOptional()
	a11y?: object;
}

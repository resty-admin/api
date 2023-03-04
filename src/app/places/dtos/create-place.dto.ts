import { Field, InputType } from "@nestjs/graphql";
import { Transform, Type } from "class-transformer";
import { isISO8601, ValidateNested } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

import { IsNotEmpty, IsObject, IsOptional, IsString } from "../../shared";
import { InputEntity } from "../../shared/interfaces";
import { IsMap } from "../../shared/validators/is-map.validator";
import { WorkingHoursDto, WorkingHoursInput } from "./date-types.dto";

@InputType()
export class CreatePlaceInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	name: string;

	@Field(() => String, { nullable: true })
	address?: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	company: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Transform(({ value }) => ({ id: value }))
	file?: InputEntity;

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

	@Field(() => GraphQLJSONObject, { nullable: true })
	@IsObject()
	@IsOptional()
	a11y?: object;
}

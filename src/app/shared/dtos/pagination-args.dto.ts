import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

import { IsOptional, IsString, Max } from "../../shared";

@ArgsType()
export class PaginationArgsDto {
	@Field(() => Int, { nullable: true, defaultValue: 0 })
	skip?: number;

	@Field(() => Int, { nullable: true, defaultValue: 10 })
	@Max(50)
	take?: number;

	@Field(() => [FiltersArgsDto], { nullable: true })
	@IsOptional()
	// @ApiProperty()
	filtersArgs?: FiltersArgsDto[];
}

@InputType()
export class FiltersArgsDto {
	@Field(() => String)
	@IsString()
	key: string;

	@Field(() => String)
	@IsString()
	operator: string;

	@Field(() => String)
	@IsString()
	value: string;
}

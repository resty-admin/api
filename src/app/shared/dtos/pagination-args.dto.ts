import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

import { IsOptional, IsString, Max, Min } from "../../shared";

@ArgsType()
export class PaginationArgsDto {
	@Field(() => Int)
	@Min(0)
	skip = 0;

	@Field(() => Int)
	@Min(1)
	@Max(50)
	take = 25;

	@Field(() => FiltersArgsDto, { nullable: true })
	@IsOptional()
	@IsString()
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

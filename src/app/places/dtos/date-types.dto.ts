import { Field, InputType, Int } from "@nestjs/graphql";

import { IsNotEmpty, IsNumber, IsString } from "../../shared";

@InputType()
export class WorkingHoursDto {
	@IsNumber()
	@IsNotEmpty()
	@Field(() => Int)
	start: number;

	@IsNumber()
	@IsNotEmpty()
	@Field(() => Int)
	end: number;
}

@InputType()
export class WorkingHoursInput {
	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	name: string;

	@Field(() => Int)
	@IsNumber()
	@IsNotEmpty()
	start: number;

	@Field(() => Int)
	@IsNumber()
	@IsNotEmpty()
	end: number;
}

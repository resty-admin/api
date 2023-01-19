import { Field, InputType, Int } from "@nestjs/graphql";

import { IsNotEmpty, IsNumber, IsString } from "../../shared";

export class WorkingHoursDto {
	@IsNumber()
	@IsNotEmpty()
	start: number;

	@IsNumber()
	@IsNotEmpty()
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

import { Field, InputType } from "@nestjs/graphql";

import { IsDate, IsString } from "../../shared";

@InputType()
export class IsTableAvailableInput {
	@Field(() => String)
	@IsString()
	tableId: string;

	@Field(() => Date)
	// @IsISO8601()
	@IsDate()
	date: Date;
}

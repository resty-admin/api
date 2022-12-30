import { Field, InputType } from "@nestjs/graphql";

import { IsNotEmpty, IsString } from "../../shared";

export class CreateCommandDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;
}

@InputType()
export class CreateCommandInput {
	@Field(() => String)
	name: string;
}

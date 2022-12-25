import { Field, InputType } from "@nestjs/graphql";

import { IsNotEmpty, IsString } from "../../shared";

export class EmitCommandDto {
	@IsString()
	@IsNotEmpty()
		// @ApiProperty()
	command: string;

	@IsString()
	@IsNotEmpty()
		// @ApiProperty()
	table: string;
}


@InputType()
export class EmitCommandInput {
	@Field(() => String)
	@IsNotEmpty()
	command: string;

	@Field(() => String)
	@IsNotEmpty()
	table: string;
}

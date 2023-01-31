import { Field, InputType } from "@nestjs/graphql";

import { IsCryptedLength, IsNotEmpty, IsString } from "../../shared";

export class ResetPasswordDto {
	@IsString()
	@IsNotEmpty()
	@IsCryptedLength(5)
	password: string;
}

@InputType()
export class ResetPasswordInput {
	@Field(() => String)
	@IsString()
	@IsCryptedLength(5)
	password: string;
}

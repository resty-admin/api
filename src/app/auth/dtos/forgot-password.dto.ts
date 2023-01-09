import { Field, InputType } from "@nestjs/graphql";
import { ValidateIf } from "class-validator";

import { IsNotEmpty, IsString } from "../../shared";

export class ForgotPasswordDto {
	@ValidateIf(({ email }: ForgotPasswordDto) => !email)
	@IsString()
	@IsNotEmpty()
	tel: string;

	@ValidateIf(({ tel }: ForgotPasswordDto) => !tel)
	@IsString()
	@IsNotEmpty()
	email: string;
}

@InputType()
export class ForgotPasswordInput {
	@Field(() => String)
	@ValidateIf(({ email }: ForgotPasswordDto) => !email)
	@IsString()
	tel: string;

	@Field(() => String)
	@ValidateIf(({ tel }: ForgotPasswordDto) => !tel)
	@IsString()
	email: string;
}

import { Field, InputType } from "@nestjs/graphql";
import { ValidateIf } from "class-validator";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

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
	@Field(() => String, { nullable: true })
	@ValidateIf(({ email }: ForgotPasswordDto) => !email)
	@IsString()
	@IsOptional()
	tel: string;

	@Field(() => String, { nullable: true })
	@ValidateIf(({ tel }: ForgotPasswordDto) => !tel)
	@IsString()
	@IsOptional()
	email: string;
}

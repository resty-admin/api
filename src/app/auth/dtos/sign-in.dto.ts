import { Field, InputType } from "@nestjs/graphql";
import { ValidateIf } from "class-validator";

import { IsCryptedLength, IsNotEmpty, IsString } from "../../shared";

export class SignInDto {
	@ValidateIf(({ email }: SignInDto) => !email)
	@IsString()
	@IsNotEmpty()
	tel: string;

	@ValidateIf(({ tel }: SignInDto) => !tel)
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@IsCryptedLength(5)
	password: string;
}

@InputType()
export class SignInInput {
	@Field(() => String)
	@ValidateIf(({ email }: SignInDto) => !email)
	@IsString()
	tel: string;

	@Field(() => String)
	@ValidateIf(({ tel }: SignInDto) => !tel)
	@IsString()
	email: string;

	@Field(() => String)
	@IsString()
	@IsCryptedLength(5)
	password: string;
}

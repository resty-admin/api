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
	@Field(() => String, { nullable: true })
	@ValidateIf(({ email }: SignInInput) => !email)
	tel: string;

	@Field(() => String, { nullable: true })
	@ValidateIf(({ tel }: SignInInput) => !tel)
	@IsString()
	email: string;

	@Field(() => String)
	@IsString()
	@IsCryptedLength(5)
	password: string;
}

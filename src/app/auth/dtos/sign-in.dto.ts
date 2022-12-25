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

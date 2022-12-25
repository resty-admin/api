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

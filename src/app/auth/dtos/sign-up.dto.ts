import { ValidateIf } from "class-validator";
import { UserRoleEnum } from "src/app/shared/enums";

import { IsCryptedLength, IsEnum, IsNotEmpty, IsString } from "../../shared";

export class SignUpDto {
	@ValidateIf(({ email }: SignUpDto) => !email)
	@IsString()
	@IsNotEmpty()
	tel: string;

	@ValidateIf(({ tel }: SignUpDto) => !tel)
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@IsCryptedLength(5)
	password: string;

	@IsEnum(UserRoleEnum)
	@IsNotEmpty()
	role: UserRoleEnum;
}

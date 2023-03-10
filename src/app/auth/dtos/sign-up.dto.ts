import { Field, InputType } from "@nestjs/graphql";
import { ValidateIf } from "class-validator";
import { UserRoleEnum } from "src/app/shared/enums";

import { IsCryptedLength, IsEnum, IsNotEmpty, IsString } from "../../shared";
import type { SignInDto } from "./sign-in.dto";

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

	@IsEnum([UserRoleEnum.WAITER, UserRoleEnum.CLIENT, UserRoleEnum.HOSTESS, UserRoleEnum.MANAGER, UserRoleEnum.HOOKAH])
	@IsNotEmpty()
	role: UserRoleEnum;
}

@InputType()
export class SignUpInput {
	@Field(() => String, { nullable: true })
	@ValidateIf(({ email }: SignInDto) => !email)
	@IsString()
	tel: string;

	@Field(() => String, { nullable: true })
	@ValidateIf(({ tel }: SignInDto) => !tel)
	@IsString()
	email: string;

	@Field(() => String)
	@IsString()
	@IsCryptedLength(5)
	password: string;

	@Field(() => UserRoleEnum)
	@IsEnum([UserRoleEnum.WAITER, UserRoleEnum.CLIENT, UserRoleEnum.HOSTESS, UserRoleEnum.MANAGER, UserRoleEnum.HOOKAH])
	role: UserRoleEnum;
}

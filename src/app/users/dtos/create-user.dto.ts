import { UserRoleEnum } from "src/app/shared/enums";

import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "../../shared";

export class CreateUserDto {
	@IsEmail()
	// @ApiProperty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	// @ApiProperty()
	password: string;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	@IsEnum([UserRoleEnum.CLIENT, UserRoleEnum.WAITER, UserRoleEnum.HOOKAH, UserRoleEnum.HOSTESS])
	role: UserRoleEnum;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	@IsOptional()
	tel: string;
}

import { Field, InputType } from "@nestjs/graphql";
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
	password?: string;

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

@InputType()
export class CreateUserInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String)
	@IsEmail()
	email: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@MinLength(5)
	// @ApiProperty()
	password?: string;

	@Field(() => UserRoleEnum)
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	@IsEnum([UserRoleEnum.CLIENT, UserRoleEnum.WAITER, UserRoleEnum.HOOKAH, UserRoleEnum.HOSTESS])
	role: UserRoleEnum;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	tel?: string;
}

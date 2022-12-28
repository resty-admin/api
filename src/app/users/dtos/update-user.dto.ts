import { Field } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "../../shared";

export class UpdateUserDto {
	@IsEmail()
	// @ApiProperty()
	@IsOptional()
	email: string;

	@IsString()
	@IsOptional()
	@MinLength(5)
	// @ApiProperty()
	password: string;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	@IsOptional()
	tel: string;
}

export class UpdateStatusUserDto {
	@IsEmail()
	// @ApiProperty()
	@IsOptional()
	email: string;

	@IsString()
	@IsOptional()
	@MinLength(5)
	// @ApiProperty()
	password: string;

	@IsString()
	@IsOptional()
	@MinLength(5)
	// @ApiProperty()
	status: string;
}

export class UpdateUserInput {
	@Field(() => String)
	@IsUUID()
	id: string;

	@Field(() => String)
	@IsOptional()
	email: string;

	@Field(() => String)
	@IsString()
	@IsOptional()
	@MinLength(5)
	// @ApiProperty()
	password: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	@IsOptional()
	tel: string;
}

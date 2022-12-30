import { Field, InputType } from "@nestjs/graphql";

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

@InputType()
export class UpdateUserInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	email?: string;

	@Field(() => String, { nullable: true })
	@IsString()
	@MinLength(5)
	// @ApiProperty()
	password?: string;

	@Field(() => String, { nullable: true })
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	tel?: string;
}

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
	status: string;
}

@InputType()
export class UpdateUserInput {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	email?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	tel?: string;
}

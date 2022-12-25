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

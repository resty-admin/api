import { IFile } from "src/app/shared/interfaces";

import { IsNotEmpty, IsOptional, IsString, MinLength } from "../../shared";

export class CreateCompanyDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(1)
	// @ApiProperty()
	name: string;

	// @ApiProperty()
	@IsOptional()
	logo: IFile;
}

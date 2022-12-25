import { IFile } from "src/app/shared/interfaces";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateCompanyDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	// @ApiProperty()
	@IsOptional()
	logo: IFile;

	// @ApiProperty()
	@IsOptional()
	@IsString()
	employees: string[];
}

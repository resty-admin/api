import { IsBoolean } from "class-validator";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class CreateAttributeGroupDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsBoolean()
	@IsOptional()
	// @ApiProperty()
	isUniq: boolean;

	@IsString()
	// @ApiProperty()
	@IsNotEmpty()
	place: string;
}

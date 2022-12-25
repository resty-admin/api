import { IsBoolean } from "class-validator";

import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateAttributeGroupDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsBoolean()
	@IsOptional()
	// @ApiProperty()
	isUniq: boolean;
}

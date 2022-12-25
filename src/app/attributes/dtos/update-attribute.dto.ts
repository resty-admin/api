import { IsNotEmpty, IsString } from "../../shared";

export class UpdateAttributeDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;
}

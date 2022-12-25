import { IsNotEmpty, IsString } from "../../shared";

export class UpdateCommandDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;
}

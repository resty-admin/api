import { IsNotEmpty, IsString } from "../../shared";

export class CreateCommandDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;
}

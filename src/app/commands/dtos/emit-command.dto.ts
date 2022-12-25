import { IsNotEmpty, IsString } from "../../shared";

export class EmitCommandDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	command: string;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	table: string;
}

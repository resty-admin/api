import { IsNotEmpty, IsString } from "../../shared";

export class CreateAccountingSystemDto {
	@IsNotEmpty()
	// @ApiProperty()
	@IsString()
	name: string;
}

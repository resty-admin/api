import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateAccountingSystemDto {
	@IsNotEmpty()
	// @ApiProperty()
	@IsString()
	@IsOptional()
	name: string;
}

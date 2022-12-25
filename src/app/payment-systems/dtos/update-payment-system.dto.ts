import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdatePaymentSystemDto {
	@IsNotEmpty()
	// @ApiProperty()
	@IsString()
	@IsOptional()
	name: string;
}

import { IsNotEmpty, IsString } from "../../shared";

export class CreatePaymentSystemDto {
	@IsNotEmpty()
	// @ApiProperty()
	@IsString()
	name: string;
}

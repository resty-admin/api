import { IsNotEmpty, IsString } from "../../shared";

export class CreatePaymentOrderLinkDto {
	@IsNotEmpty()
	// @ApiProperty()
	@IsString()
	orderId: string;
}

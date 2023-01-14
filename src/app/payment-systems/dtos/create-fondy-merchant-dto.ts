import { IsNotEmpty, IsString } from "../../shared";

export class CreateFondyMerchantDto {
	@IsNotEmpty()
	// @ApiProperty()
	@IsString()
	merchantId: string;

	// @IsNotEmpty()
	// // @ApiProperty()
	// @IsString()
	// secretKey: string;

	@IsNotEmpty()
	// @ApiProperty()
	@IsString()
	company: string;
}

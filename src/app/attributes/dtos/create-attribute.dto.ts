import { IsNotEmpty, IsNumber, IsOptional, IsString } from "../../shared";

export class CreateAttributeDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsNumber()
	@IsOptional()
	// @ApiProperty()
	price: number;
}

import { IsNotEmpty, IsNumber } from "../../shared";

export class WorkingHoursDto {
	@IsNumber()
	@IsNotEmpty()
	// @ApiProperty()
	start: number;

	@IsNumber()
	@IsNotEmpty()
	// @ApiProperty()
	end: number;
}

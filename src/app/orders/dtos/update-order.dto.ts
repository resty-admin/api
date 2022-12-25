import { OrderTypeEnum } from "src/app/shared/enums";

import { IsEnum, IsNotEmpty, IsOptional } from "../../shared";

export class UpdateOrderDto {
	@IsEnum(OrderTypeEnum)
	@IsNotEmpty()
	@IsOptional()
	// @ApiProperty()
	type: OrderTypeEnum;
}

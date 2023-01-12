import { Controller } from "@nestjs/common";

import { ACTIVE_ORDERS } from "../constant";

@Controller(ACTIVE_ORDERS)
export class OrdersController {
	// constructor(private readonly _ordersService: OrdersService) {}
	//
	// @Post()
	// @ApiOperation({ summary: `Create order` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully created.",
	// 	type: ActiveOrderEntity
	// })
	// async createOrder(@Body() order: CreateOrderDto): Promise<ActiveOrderEntity> {
	// 	return this._ordersService.creatOrder(order);
	// }
	//
	// @Patch("/:id")
	// @ApiOperation({ summary: `Update order` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully updated.",
	// 	type: ActiveOrderEntity
	// })
	// async updateOrder(@Param("id", ParseUUIDPipe) id: string, @Body() order: UpdateOrderDto): Promise<ActiveOrderEntity> {
	// 	return this._ordersService.updateOrder(id, order);
	// }
	//
	// @Delete("/:id")
	// @ApiOperation({ summary: `Delete order` })
	// async deleteOrder(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
	// 	return this._ordersService.deleteOrder(id);
	// }
}

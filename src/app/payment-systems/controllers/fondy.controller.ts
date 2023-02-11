import { Body, Controller, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";

import { environment } from "../../../environments/environment";
import { FONDY } from "../constant";
import { FondyService } from "../services/fondy.service";

@Controller(FONDY)
export class FondyController {
	constructor(private readonly _fondyService: FondyService) {}

	@Post("check")
	async checkFondy(@Body() body: any, @Res() response: Response, @Query("orderId") orderId: string) {
		const baseUrl = environment.production ? `https://dev.resty.od.ua/` : `http://192.168.68.101:4201`;

		const paymentStatus = await this._fondyService.verifyOrder(orderId);
		return response.redirect(`${baseUrl}/active-orders/${orderId}/payment-status?status=${paymentStatus}`);
	}
}

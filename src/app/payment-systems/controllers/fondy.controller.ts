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
		const baseUrl = environment.fondy.redirectUrl;

		const paymentStatus = await this._fondyService.verifyOrder(orderId);
		const [id, ..._] = orderId.split("_");
		return response.redirect(`${baseUrl}/active-orders/${id}/payment-status?status=${paymentStatus}`);
	}
}

import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";

import { environment } from "../../../environments/environment";
import { FONDY } from "../constant";
import { FondyService } from "../services/fondy.service";

@Controller(FONDY)
export class FondyController {
	constructor(private readonly _fondyService: FondyService) {}

	@Post("check")
	async checkFondy(@Body() body: any, @Res() response: Response) {
		const baseUrl = environment.production ? `https://dev.resty.od.ua/` : `http://192.168.68.102:4201`;

		await this._fondyService.verifyOrder(body);
		return response.redirect(`${baseUrl}/orders/${body.order_id}/payment-status`);
	}
}

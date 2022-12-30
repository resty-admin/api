import { Body, Controller, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { Response } from "express";

import { environment } from "../../../environments/environment";
import { JwtGuard } from "../../auth";
import { FONDY } from "../constant";
import { CreateFondyMerchantDto, CreatePaymentOrderLinkDto } from "../dtos";
import { FondyService } from "../services/fondy.service";

@Controller(FONDY)
export class FondyController {
	constructor(private readonly _fondyService: FondyService) {}

	@Post("check")
	async checkFondy(@Body() body: any, @Res() response: Response) {
		const baseUrl = environment.production ? `https://dev.resty.od.ua/` : `http://localhost:4201`;

		return response.redirect(`${baseUrl}/orders/${body.order_id}/payment-status`);
	}

	@Get("verify-order/:id")
	@ApiOperation({ summary: "Verify fondy order" })
	@ApiCreatedResponse({
		description: "Verify fondy order"
	})
	async paymentSuccessfull(@Param("id") id: string) {
		return this._fondyService.verifyOrder(id);
	}

	@Post("new-merchant")
	@ApiOperation({ summary: "Add new fondy merchant" })
	@ApiCreatedResponse({
		description: "Merchant has been created."
	})
	async addMerchant(@Body() createFondyMerchantDto: CreateFondyMerchantDto) {
		return this._fondyService.createMerchant(createFondyMerchantDto);
	}

	@Post("create-payment-link")
	@ApiOperation({ summary: "Create payment link" })
	@UseGuards(JwtGuard)
	@ApiCreatedResponse({
		description: "Link created"
	})
	async createPaymentOrderLink(@Body() createPaymentOrderLinkDto: CreatePaymentOrderLinkDto) {
		const link = await this._fondyService.createPaymentOrderLink(createPaymentOrderLinkDto);
		return {
			link
		};
	}
}

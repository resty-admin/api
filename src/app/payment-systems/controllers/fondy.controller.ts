import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

import { JwtGuard } from "../../auth";
import { FONDY } from "../constant";
import { CreateFondyMerchantDto, CreatePaymentOrderLinkDto } from "../dtos";
import { FondyService } from "../services/fondy.service";

@Controller(FONDY)
export class FondyController {
	constructor(private readonly _fondyService: FondyService) {}

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
		return this._fondyService.createPaymentOrderLink(createPaymentOrderLinkDto);
	}
}

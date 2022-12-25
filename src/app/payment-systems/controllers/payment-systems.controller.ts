import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

import { PAYMENT_SYSTEMS } from "../constant";
import { CreatePaymentSystemDto, UpdatePaymentSystemDto } from "../dtos";
import { PaymentSystemEntity } from "../entities";
import { PaymentSystemsService } from "../services";

@Controller(PAYMENT_SYSTEMS)
export class PaymentSystemsController {
	constructor(private readonly _paymentSystemsService: PaymentSystemsService) {}

	@Post()
	@ApiOperation({ summary: `Create payment system` })
	@ApiCreatedResponse({
		description: "The record has been successfully created.",
		type: PaymentSystemEntity
	})
	async createPaymentSystem(@Body() paymentSystemDto: CreatePaymentSystemDto): Promise<PaymentSystemEntity> {
		return this._paymentSystemsService.creatPaymentSystem(paymentSystemDto);
	}

	@Patch("/:id")
	@ApiOperation({ summary: `Update payment system` })
	@ApiCreatedResponse({
		description: "The record has been successfully updated.",
		type: PaymentSystemEntity
	})
	async updatePaymentSystem(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() paymentSystemDto: UpdatePaymentSystemDto
	): Promise<PaymentSystemEntity> {
		return this._paymentSystemsService.updatePaymentSystem(id, paymentSystemDto);
	}

	@Delete("/:id")
	@ApiOperation({ summary: `Delete payment system` })
	async deletePaymentSystem(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
		return this._paymentSystemsService.deletePaymentSystem(id);
	}
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as CloudIpsp from "cloudipsp-node-js-sdk";
import { ApiService } from "src/app/shared/api";
import { CryptoService } from "src/app/shared/crypto";

import { CompaniesService } from "../../companies/services";
import type { CreateFondyMerchantDto } from "../dtos";
import type { CreatePaymentOrderLinkDto } from "../dtos";
import { PaymentSystemEntity } from "../entities";
import { FondyEntity } from "../entities/fondy.entity";

@Injectable()
export class FondyService {
	readonly fondy;

	constructor(
		@InjectRepository(PaymentSystemEntity) private readonly _paymentSystemRepository,
		private readonly _apiService: ApiService,
		private readonly _cryptoService: CryptoService,
		@InjectRepository(FondyEntity) private readonly _fondyRepository,
		private readonly _companiesService: CompaniesService
	) {
		this.fondy = new CloudIpsp({
			merchantId: 1_396_424,
			secretKey: "test"
		});
	}

	async createPaymentOrderLink(createPaymentOrderLinkDto: CreatePaymentOrderLinkDto) {
		const requestData = {
			order_id: Math.random() * 1000,
			order_desc: createPaymentOrderLinkDto.orderId,
			currency: "UAH",
			amount: "144",
			response_url: `http://192.168.68.52:4200/auth/test?order=${createPaymentOrderLinkDto.orderId}`
			// server_callback_url: "http://localhost:3000/api/payment/fondy/success-response"
		};

		this.fondy
			.Checkout(requestData)
			.then((data) => {
				console.log(data, requestData);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	async verifyOrder(id: string) {
		const requestData = {
			order_id: id
		};

		this.fondy
			.Status(requestData)
			.then((data) => {
				console.log(data, requestData);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	async createMerchant(createFondyMerchantDto: CreateFondyMerchantDto) {
		const savedMerchant = await this._fondyRepository.save({
			...createFondyMerchantDto,
			company: { id: createFondyMerchantDto.company }
		});

		return this._fondyRepository.findOne({
			where: { id: savedMerchant.id }
		});
	}

	async merchantInstance(userId: string) {
		console.log("userid", userId);
		// const user = this._companiesService.getCompany();
	}
}

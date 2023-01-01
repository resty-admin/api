import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as CloudIpsp from "cloudipsp-node-js-sdk";
import { ApiService } from "src/app/shared/api";
import { CryptoService } from "src/app/shared/crypto";
import { Repository } from "typeorm";

import { environment } from "../../../environments/environment";
import { CompaniesService } from "../../companies/services";
import { ActiveOrderEntity } from "../../orders/entities";
import type { CreateFondyMerchantDto } from "../dtos";
import type { CreatePaymentOrderLinkDto } from "../dtos";
import { PaymentSystemEntity } from "../entities";
import { FondyEntity } from "../entities/fondy.entity";

@Injectable()
export class FondyService {
	readonly fondy;

	constructor(
		@InjectRepository(PaymentSystemEntity) private readonly _paymentSystemRepository,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>,
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
		const order = await this._ordersRepository.findOne({ where: { id: createPaymentOrderLinkDto.orderId } });

		const baseUrl = environment.production ? `https://dev-api.resty.od.ua` : `http://192.168.68.105:3000`;

		const requestData = {
			order_id: order.id,
			order_desc: `resty order ${order.id}`,
			currency: "UAH",
			amount: order.totalPrice,
			response_url: `${baseUrl}/api/fondy/check`
		};

		const result = await this.fondy.Checkout(requestData);

		return result.checkout_url;
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

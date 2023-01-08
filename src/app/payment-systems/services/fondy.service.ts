import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as CloudIpsp from "cloudipsp-node-js-sdk";
import { ApiService } from "src/app/shared/api";
import { CryptoService } from "src/app/shared/crypto";
import { In, Repository } from "typeorm";

import { environment } from "../../../environments/environment";
import { CompaniesService } from "../../companies/services";
import { ActiveOrderEntity, UserToOrderEntity } from "../../orders/entities";
import { OrderStatusEnum, ProductToOrderStatusEnum } from "../../shared/enums";
import type { CreateFondyMerchantDto, CreatePaymentOrderLinkDto } from "../dtos";
import { PaymentSystemEntity } from "../entities";
import { FondyEntity } from "../entities/fondy.entity";

@Injectable()
export class FondyService {
	readonly fondy;

	constructor(
		@InjectRepository(PaymentSystemEntity) private readonly _paymentSystemRepository,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>,
		@InjectRepository(UserToOrderEntity) private readonly _userToOrderRepository: Repository<UserToOrderEntity>,
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

	async createPaymentOrderLink({ users, orderId }: CreatePaymentOrderLinkDto) {
		const usersToOrders = await this._userToOrderRepository.find({
			where: {
				user: {
					id: In(users)
				},
				order: {
					id: orderId
				}
			},
			relations: ["product", "user", "order", "attributes"]
		});

		if (usersToOrders.length > 0 && usersToOrders[0].paymentLink) {
			return usersToOrders[0].paymentLink;
		}

		const baseUrl = false && environment.production ? `https://dev-api.resty.od.ua` : `http://localhost:3000`;

		const requestData = {
			order_id: `${orderId}`,
			order_desc: usersToOrders.reduce((pre, curr) => `${pre} ${curr.product.name} x${curr.count} ` + `\n`, ""),
			currency: "UAH",
			amount:
				100 *
				usersToOrders.reduce(
					(pre, curr) =>
						pre +
						curr.count *
							((curr.attributes.length > 0 ? curr.attributes.reduce((pre, curr) => pre + curr.price, 0) : 0) +
								curr.product.price),
					0
				),
			response_url: `${baseUrl}/api/fondy/check`
		};

		const result = await this.fondy.Checkout(requestData);

		for (const el of usersToOrders) {
			await this._userToOrderRepository.save({
				id: el.id,
				paymentLink: result.checkout_url
			});
		}

		return result.checkout_url;
	}

	async verifyOrder(body) {
		const [orderId, userId] = body.order_id.split("_");

		const usersToOrders = await this._userToOrderRepository.find({
			where: {
				user: {
					id: userId
				},
				order: {
					id: orderId
				}
			},
			relations: ["product", "user", "order"]
		});

		for (const el of usersToOrders) {
			await this._userToOrderRepository.save({
				id: el.id,
				status: ProductToOrderStatusEnum.PAID
			});
		}

		const order = await this._ordersRepository.findOne({ where: { id: orderId }, relations: ["usersToOrders"] });

		const allProductsPaid = order.usersToOrders.every((el) => el.status === ProductToOrderStatusEnum.PAID);

		if (allProductsPaid) {
			await this._ordersRepository.save({
				...order,
				status: OrderStatusEnum.PAID
			});
		}
		console.log("body", body);
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

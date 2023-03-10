import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as CloudIpsp from "cloudipsp-node-js-sdk";
import { ApiService } from "src/app/shared/api";
import { CryptoService } from "src/app/shared/crypto";
import { In, Repository } from "typeorm";

import { environment } from "../../../environments/environment";
import { CompaniesService } from "../../companies/services";
import { ActiveOrderEntity, ProductToOrderEntity } from "../../orders/entities";
import { OrdersNotificationsService } from "../../orders/services";
import { ProductToOrderPaidStatusEnum } from "../../shared/enums";
import { PaymentSystemEntity } from "../entities";
import { PlaceToPaymentSystemEntity } from "../entities/place-to-payment-system.entity";

@Injectable()
export class FondyService {
	readonly fondy;

	// orderId: string;

	constructor(
		@InjectRepository(PaymentSystemEntity) private readonly _paymentSystemRepository: Repository<PaymentSystemEntity>,
		@InjectRepository(PlaceToPaymentSystemEntity)
		private readonly _paymentPlaceRepository: Repository<PlaceToPaymentSystemEntity>,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>,
		@InjectRepository(ProductToOrderEntity) private readonly productToOrderRepository: Repository<ProductToOrderEntity>,
		private readonly _apiService: ApiService,
		private readonly _cryptoService: CryptoService,
		private readonly _companiesService: CompaniesService,
		private readonly _ordersNotificationService: OrdersNotificationsService
	) {
		this.fondy = new CloudIpsp({
			merchantId: 1_396_424,
			secretKey: "test",
			protocol: "2.0"
		});
	}

	async createPaymentOrderLink(pTos: string[]) {
		const productsToOrders = await this.productToOrderRepository.find({
			where: {
				id: In(pTos)
			},
			relations: [
				"product",
				"order",
				"order.users",
				"order.place",
				"attributesToProduct",
				"attributesToProduct.attribute"
			]
		});

		// const baseUrl = environment.production ? `http://192.168.0.6:3000` : `http://192.168.68.105:3000`;
		const { baseUrl } = environment.fondy;

		const totalPrice =
			100 *
			productsToOrders.reduce(
				(pre, curr) =>
					pre +
					curr.count *
						((curr.attributesToProduct || []).reduce((pre, curr) => pre + curr.attribute.price * curr.count, 0) +
							curr.product.price),
				0
			);

		const [{ order }] = productsToOrders;
		const orderId = order.id;
		const users = order.users.map((el) => el.id);
		const merchant = await this.getMerchantByPlace(order.place.id);

		// 1_396_4247
		const receivers = [
			{
				requisites: {
					amount: totalPrice * 0.95,
					merchant_id: (merchant.placeConfigFields as any).merchantId
				},
				type: "merchant"
			}
		];

		const fondyOrderId = `${orderId}_${pTos.reduce((pre, curr) => `${pre}${curr}@`, "@")}_${users.reduce(
			(pre, curr) => `${pre}${curr}$`,
			"$"
		)}_${new Date().toISOString()}`;

		const requestData = {
			order_id: fondyOrderId,
			order_desc: productsToOrders.reduce((pre, curr) => `${pre} ${curr.product.name} x${curr.count} ` + `\n`, ""),
			currency: "UAH",
			amount: totalPrice,
			receivers,
			response_url: `${baseUrl}/api/fondy/check?orderId=${fondyOrderId}`
		};

		const result = await this.fondy.Checkout(requestData);
		return result.checkout_url;
	}

	async verifyOrder(fondyOrderId: string) {
		const successStatus = (await this.fondy.Status({ order_id: fondyOrderId })).response_status === "success";

		if (!successStatus) {
			return "failed";
		}
		const [orderId] = fondyOrderId.split("_");

		// const users = fondyOrderId.match(/(?<=\$)(.*?)(?=\$)/g);
		const pTos = fondyOrderId.match(/(?<=@)(.*?)(?=@)/g);

		// const productsToOrders = await this.productToOrderRepository.find({
		// 	where: {
		// 		user: {
		// 			id: In(users)
		// 		},
		// 		order: {
		// 			id: orderId
		// 		}
		// 	},
		// 	relations: ["product", "user", "order"]
		// });

		const productsToOrders = await this.productToOrderRepository.find({
			where: {
				id: In(pTos)
			},
			relations: ["product", "user", "order"]
		});

		for (const el of productsToOrders) {
			await this.productToOrderRepository.save({
				id: el.id,
				paidStatus: ProductToOrderPaidStatusEnum.PAID
			});
		}

		await this._ordersNotificationService.paymentSuccessOrderEvent(orderId, productsToOrders);
		return "success";
	}

	async getMerchantByPlace(placeId: string): Promise<PlaceToPaymentSystemEntity> {
		return this._paymentPlaceRepository.findOne({
			where: {
				place: {
					id: placeId
				}
			}
		});
	}
}

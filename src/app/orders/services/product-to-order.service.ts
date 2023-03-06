import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { In, Repository } from "typeorm";

import type { ManualPaymentEnum } from "../../shared/enums";
import { ErrorsEnum, ProductToOrderPaidStatusEnum, ProductToOrderStatusEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import type { ConfirmProductToOrderInput } from "../dtos";
import { ActiveOrderEntity, ProductToOrderEntity } from "../entities";
import { OrdersNotificationsService } from "./orders.notifications.service";
import { OrdersService } from "./orders.service";

@Injectable()
export class ProductToOrderService {
	constructor(
		private readonly _ordersService: OrdersService,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>,
		@InjectRepository(ProductToOrderEntity) private readonly productToOrderRepository: Repository<ProductToOrderEntity>,
		private readonly _ordersNotificationService: OrdersNotificationsService
	) {}

	async confirmProductsToOrders(addProductsToOrders: ConfirmProductToOrderInput[], user: IUser) {
		await this.productToOrderRepository.save(
			addProductsToOrders.map(
				(productToOrder) =>
					({
						order: {
							id: productToOrder.orderId
						},
						product: {
							id: productToOrder.productId
						},
						user: {
							id: user.id
						},
						attributesToProduct: Object.entries(
							(productToOrder.attributesIds || []).reduce(
								(pre, curr) => ({
									...pre,
									[curr]: pre[curr] ? pre[curr] + 1 : 1
								}),
								{}
							)
						).map(([id, count]) => ({ attribute: { id }, count })),
						count: productToOrder.count
					} as any)
			)
		);

		if (addProductsToOrders.length === 0) {
			throw new GraphQLError(ErrorsEnum.NoActiveProductsExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const [{ orderId }] = addProductsToOrders;

		await this._ordersNotificationService.confirmOrderEvent(orderId);
		await this.updateOrderTotalPrice(orderId);

		return this._ordersRepository.findOne({ where: { id: orderId } });
	}

	async updateOrderTotalPrice(id) {
		const order: ActiveOrderEntity = await this._ordersRepository.findOne({
			where: {
				id
			},
			relations: [
				"productsToOrders",
				"productsToOrders.product",
				"productsToOrders.attributesToProduct",
				"productsToOrders.attributesToProduct.attribute",
				"productsToOrders.user"
			]
		});

		console.log("totalPrice", this.calculateTotalPrice(order.productsToOrders));

		return this._ordersRepository.save({
			...order,
			totalPrice: this.calculateTotalPrice(order.productsToOrders)
		});
	}

	async rejectProductInOrder(productToOrderIds: string[]) {
		const pTos = await this.productToOrderRepository.find({
			where: {
				id: In(productToOrderIds)
			},
			relations: ["order", "user", "order.table", "product", "order.users", "order.place"]
		});

		const updatedPtos = pTos.map(
			(el) => ({ ...el, status: ProductToOrderStatusEnum.REJECTED } as ProductToOrderEntity)
		);

		const usersIds = [...new Set(updatedPtos.map((el) => el.user.id))];
		const users = usersIds.map((id) => updatedPtos.find((el) => el.user.id === id).user);

		await this._ordersNotificationService.rejectOrderPtosEvent(
			{
				...pTos[0].order,
				users
			} as ActiveOrderEntity,
			updatedPtos
		);
		return this.productToOrderRepository.save(updatedPtos);
	}

	async approveProductInOrder(productToOrderIds: string[]) {
		const pTos = await this.productToOrderRepository.find({
			where: {
				id: In(productToOrderIds)
			},
			relations: ["order", "user", "order.table", "product", "order.users", "order.place"]
		});

		const updatedPtos = pTos.map(
			(el) => ({ ...el, status: ProductToOrderStatusEnum.APPROVED } as ProductToOrderEntity)
		);

		const usersIds = [...new Set(updatedPtos.map((el) => el.user.id))];
		const users = usersIds.map((id) => updatedPtos.find((el) => el.user.id === id).user);
		await this._ordersNotificationService.approveOrderPtosEvent(
			{
				...pTos[0].order,
				users
			} as ActiveOrderEntity,
			updatedPtos
		);
		return this.productToOrderRepository.save(updatedPtos);
	}

	async setManualPayForProductsInOrder(productToOrderIds: string[], type: ManualPaymentEnum) {
		const pTos = await this.productToOrderRepository.find({
			where: {
				id: In(productToOrderIds)
			},
			relations: ["order", "order.table", "product", "order.users"]
		});

		const updatedPtos = pTos.map(
			(el) =>
				({
					...el,
					paidStatus: ProductToOrderPaidStatusEnum.WAITING
				} as ProductToOrderEntity)
		);
		await this._ordersNotificationService.waitingForManualPayOrderEvent(pTos[0].order.id, updatedPtos, type);
		return this.productToOrderRepository.save(updatedPtos);
	}

	async setPaidStatusForProductsInOrder(productToOrderIds: string[]) {
		const pTos = await this.productToOrderRepository.find({
			where: {
				id: In(productToOrderIds)
			},
			relations: ["order", "order.table", "product", "order.users", "order.place"]
		});

		const updatedPtos = pTos.map((el) => ({ ...el, paidStatus: ProductToOrderPaidStatusEnum.PAID }));
		await this._ordersNotificationService.manualPaymentSuccessEvent(pTos[0].order);
		return this.productToOrderRepository.save(updatedPtos);
	}

	calculateTotalPrice(productsToOrders: ProductToOrderEntity[]) {
		return productsToOrders.reduce(
			(pre, curr) =>
				pre +
				curr.count *
					((curr.attributesToProduct || []).reduce((pre, curr) => pre + curr.attribute.price * curr.count, 0) +
						curr.product.price),
			0
		);
	}
}

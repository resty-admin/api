import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In } from "typeorm";

import { ProductToOrderPaidStatusEnum, ProductToOrderStatusEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import type { AddProductToOrderInput, RemoveProductFromOrderInput } from "../dtos";
import { ActiveOrderEntity, UserToOrderEntity } from "../entities";
import { OrdersNotificationsService } from "./orders.notifications.service";
import { OrdersService } from "./orders.service";

@Injectable()
export class ProductToOrderService {
	constructor(
		private readonly _ordersService: OrdersService,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository,
		@InjectRepository(UserToOrderEntity) private readonly _userToOrderRepository,
		private readonly _ordersNotificationService: OrdersNotificationsService
	) {}

	async addProductToOrder(productToOrder: AddProductToOrderInput, user: IUser) {
		const order: ActiveOrderEntity = await this._ordersRepository.findOne({
			where: {
				id: productToOrder.orderId
			},
			relations: ["usersToOrders", "usersToOrders.product", "usersToOrders.attributes", "usersToOrders.user"]
		});

		const currProduct = order.usersToOrders.find((userToOrder) => {
			const isUserSame = userToOrder.user.id === user.id;
			const isProductSame = userToOrder.product.id === productToOrder.productId;
			const isAttributesLengthSame = (userToOrder.attributes || []).length === (productToOrder.attrs || []).length;
			const isAttributesSame = (userToOrder.attributes || []).every((attribute) =>
				(productToOrder.attrs || []).includes(attribute.id)
			);

			return isUserSame && isProductSame && isAttributesLengthSame && isAttributesSame;
		});

		if (currProduct) {
			const result = await this._userToOrderRepository.save({ ...currProduct, count: currProduct.count + 1 });
			await this.updateOrderTotalPrice(order.id);
			return result;
		}

		await this.updateOrderTotalPrice(order.id);
		return this._userToOrderRepository.save({
			order: {
				id: productToOrder.orderId
			},
			product: {
				id: productToOrder.productId
			},
			user: {
				id: user.id
			},
			status: ProductToOrderStatusEnum.ADDED,
			count: 1,
			...(productToOrder.attrs?.length > 0 ? { attributes: productToOrder.attrs.map((id) => ({ id })) } : {})
		});
	}

	async removeProductFromOrder(productFromOrder: RemoveProductFromOrderInput, user: IUser) {
		const order: ActiveOrderEntity = await this._ordersRepository.findOne({
			where: {
				id: productFromOrder.orderId,
				usersToOrders: {
					user: {
						id: user.id
					}
				}
			},
			relations: ["usersToOrders", "usersToOrders.product", "usersToOrders.attributes", "usersToOrders.user"]
		});

		const deleteProduct = order.usersToOrders.find((userToOrder) => {
			const isUserSame = userToOrder.user.id === user.id;
			const isProductSame = userToOrder.product.id === productFromOrder.productId;
			const isAttributesLengthSame = (userToOrder.attributes || []).length === (productFromOrder.attrs || []).length;
			const isAttributesSame = (userToOrder.attributes || []).every((attribute) =>
				(productFromOrder.attrs || []).includes(attribute.id)
			);

			return isUserSame && isProductSame && isAttributesLengthSame && isAttributesSame;
		});

		if (deleteProduct.count === 1) {
			await this._userToOrderRepository.delete(deleteProduct.id);

			return this.updateOrderTotalPrice(order.id);
		}
		await this._userToOrderRepository.save({
			...deleteProduct,
			count: deleteProduct.count - 1
		});

		return this.updateOrderTotalPrice(order.id);
	}

	async updateOrderTotalPrice(id) {
		const order: ActiveOrderEntity = await this._ordersRepository.findOne({
			where: {
				id
			},
			relations: ["usersToOrders", "usersToOrders.product", "usersToOrders.attributes", "usersToOrders.user"]
		});

		return this._ordersRepository.save({
			...order,
			totalPrice: this.calculateTotalPrice(order.usersToOrders)
		});
	}

	async rejectProductInOrder(productToOrderIds: string[]) {
		const pTos = await this._userToOrderRepository.find({
			where: {
				id: In(productToOrderIds)
			}
		});

		const updatedPtos = pTos.map((el) => ({ ...el, status: ProductToOrderStatusEnum.REJECTED }));
		await this._ordersNotificationService.rejectOrderEvent(pTos[0].order, updatedPtos);
		return this._userToOrderRepository.save(updatedPtos);
	}

	async approveProductInOrder(productToOrderIds: string[]) {
		const pTos = await this._userToOrderRepository.find({
			where: {
				id: In(productToOrderIds)
			}
		});

		const updatedPtos = pTos.map((el) => ({ ...el, status: ProductToOrderStatusEnum.APPROVED }));
		await this._ordersNotificationService.approveOrderEvent(pTos[0].order, updatedPtos);
		return this._userToOrderRepository.save(updatedPtos);
	}

	async setManualPayForProductsInOrder(productToOrderIds: string[]) {
		const pTos = await this._userToOrderRepository.find({
			where: {
				id: In(productToOrderIds)
			}
		});

		const updatedPtos = pTos.map((el) => ({ ...el, paidStatus: ProductToOrderPaidStatusEnum.WAITING }));
		await this._ordersNotificationService.waitingForManualPayOrderEvent(pTos[0].order.id);
		return this._userToOrderRepository.save(updatedPtos);
	}

	calculateTotalPrice(usersToOrders) {
		return (
			100 *
			usersToOrders.reduce(
				(pre, curr) =>
					pre +
					curr.count *
						((curr.attributes && curr.attributes.length > 0
							? curr.attributes.reduce((pre, curr) => pre + curr.price, 0)
							: 0) +
							curr.product.price),
				0
			)
		);
	}
}

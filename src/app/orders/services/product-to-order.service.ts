import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { In } from "typeorm";

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
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository,
		@InjectRepository(ProductToOrderEntity) private readonly productToOrderRepository,
		private readonly _ordersNotificationService: OrdersNotificationsService
	) {}

	// async addProductToOrder(productToOrder: AddProductToOrderInput, user: IUser) {
	// 	const order: ActiveOrderEntity = await this._ordersRepository.findOne({
	// 		where: {
	// 			id: productToOrder.orderId
	// 		},
	// 		relations: [
	// 			"productsToOrders",
	// 			"productsToOrders.product",
	// 			"productsToOrders.attributes",
	// 			"productsToOrders.user"
	// 		]
	// 	});
	//
	// 	const currProduct = order.productsToOrders.find((userToOrder) => {
	// 		const isUserSame = userToOrder.user.id === user.id;
	// 		const isProductSame = userToOrder.product.id === productToOrder.productId;
	// 		const isStatusAdded = userToOrder.status === ProductToOrderStatusEnum.ADDED;
	// 		const isAttributesLengthSame = (userToOrder.attributes || []).length === (productToOrder.attrs || []).length;
	// 		const isAttributesSame = (userToOrder.attributes || []).every((attribute) =>
	// 			(productToOrder.attrs || []).includes(attribute.id)
	// 		);
	//
	// 		return isUserSame && isStatusAdded && isProductSame && isAttributesLengthSame && isAttributesSame;
	// 	});
	//
	// 	if (currProduct) {
	// 		await this.productToOrderRepository.save({ ...currProduct, count: currProduct.count + 1 });
	// 		return this.updateOrderTotalPrice(order.id);
	// 	}
	//
	// 	await this.productToOrderRepository.save({
	// 		order: {
	// 			id: productToOrder.orderId
	// 		},
	// 		product: {
	// 			id: productToOrder.productId
	// 		},
	// 		user: {
	// 			id: user.id
	// 		},
	// 		status: ProductToOrderStatusEnum.WAITING_FOR_APPROVE,
	// 		count: 1,
	// 		...(productToOrder.attrs?.length > 0 ? { attributes: productToOrder.attrs.map((id) => ({ id })) } : {})
	// 	});
	//
	// 	return this.updateOrderTotalPrice(order.id);
	// }
	//
	// async removeProductFromOrder(productFromOrder: RemoveProductFromOrderInput, user: IUser) {
	// 	const order: ActiveOrderEntity = await this._ordersRepository.findOne({
	// 		where: {
	// 			id: productFromOrder.orderId,
	// 			productsToOrders: {
	// 				user: {
	// 					id: user.id
	// 				}
	// 			}
	// 		},
	// 		relations: [
	// 			"productsToOrders",
	// 			"productsToOrders.product",
	// 			"productsToOrders.attributes",
	// 			"productsToOrders.user"
	// 		]
	// 	});
	//
	// 	const deleteProduct = order.productsToOrders.find((userToOrder) => {
	// 		const isUserSame = userToOrder.user.id === user.id;
	// 		const isProductSame = userToOrder.product.id === productFromOrder.productId;
	// 		const isAttributesLengthSame = (userToOrder.attributes || []).length === (productFromOrder.attrs || []).length;
	// 		const isAttributesSame = (userToOrder.attributes || []).every((attribute) =>
	// 			(productFromOrder.attrs || []).includes(attribute.id)
	// 		);
	//
	// 		return isUserSame && isProductSame && isAttributesLengthSame && isAttributesSame;
	// 	});
	//
	// 	if (deleteProduct.count === 1) {
	// 		await this.productToOrderRepository.delete(deleteProduct.id);
	//
	// 		return this.updateOrderTotalPrice(order.id);
	// 	}
	// 	await this.productToOrderRepository.save({
	// 		...deleteProduct,
	// 		count: deleteProduct.count - 1
	// 	});
	//
	// 	return this.updateOrderTotalPrice(order.id);
	// }

	async confirmProductsToOrders(addProductsToOrders: ConfirmProductToOrderInput[], user: IUser) {
		await this.productToOrderRepository.save(
			addProductsToOrders.map((productToOrder) => ({
				order: {
					id: productToOrder.orderId
				},
				product: {
					id: productToOrder.productId
				},
				user: {
					id: user.id
				},
				...(productToOrder.attributesIds.length > 0
					? { attributes: productToOrder.attributesIds.map((el) => ({ id: el })) }
					: {}),
				count: productToOrder.count
			}))
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
				"productsToOrders.attributes",
				"productsToOrders.user"
			]
		});

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
			relations: ["order", "order.table", "product", "order.users"]
		});

		const updatedPtos = pTos.map((el) => ({ ...el, status: ProductToOrderStatusEnum.REJECTED }));
		await this._ordersNotificationService.rejectOrderEvent(pTos[0].order, updatedPtos);
		return this.productToOrderRepository.save(updatedPtos);
	}

	async approveProductInOrder(productToOrderIds: string[]) {
		const pTos = await this.productToOrderRepository.find({
			where: {
				id: In(productToOrderIds)
			},
			relations: ["order", "order.table", "product", "order.users"]
		});

		const updatedPtos = pTos.map((el) => ({ ...el, status: ProductToOrderStatusEnum.APPROVED }));
		await this._ordersNotificationService.approveOrderEvent(pTos[0].order, updatedPtos);
		return this.productToOrderRepository.save(updatedPtos);
	}

	async setManualPayForProductsInOrder(productToOrderIds: string[]) {
		const pTos = await this.productToOrderRepository.find({
			where: {
				id: In(productToOrderIds)
			},
			relations: ["order", "order.table", "product", "order.users"]
		});

		const updatedPtos = pTos.map((el) => ({ ...el, paidStatus: ProductToOrderPaidStatusEnum.WAITING }));
		await this._ordersNotificationService.waitingForManualPayOrderEvent(pTos[0].order.id);
		return this.productToOrderRepository.save(updatedPtos);
	}

	async setPaidStatusForProductsInOrder(productToOrderIds: string[]) {
		const pTos = await this.productToOrderRepository.find({
			where: {
				id: In(productToOrderIds)
			},
			relations: ["order", "order.table", "product", "order.users"]
		});

		const updatedPtos = pTos.map((el) => ({ ...el, paidStatus: ProductToOrderPaidStatusEnum.PAID }));
		await this._ordersNotificationService.waitingForManualPayOrderEvent(pTos[0].order.id);
		return this.productToOrderRepository.save(updatedPtos);
	}

	calculateTotalPrice(productsToOrders) {
		return (
			100 *
			productsToOrders.reduce(
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

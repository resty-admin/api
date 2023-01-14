import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as console from "console";
import { GraphQLError } from "graphql/error";

import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { OrderStatusEnum, ProductToOrderStatusEnum } from "../../shared/enums";
import { ErrorsEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { ActiveShiftEntity } from "../../shifts/entities";
import type { UpdateOrderDto } from "../dtos";
import type { CreateOrderInput, UpdateOrderInput } from "../dtos";
import type { RemoveProductFromOrderInput } from "../dtos";
import type { AddProductToOrderInput } from "../dtos/add-product-to-order.dto";
import { ActiveOrderEntity, HistoryOrderEntity, UserToOrderEntity } from "../entities";
import { OrdersGateway } from "../gateways";
import { OrdersNotificationsService } from "./orders.notifications.service";

@Injectable()
export class OrdersService {
	private findRelations = [
		"usersToOrders",
		"usersToOrders.user",
		"usersToOrders.product",
		"usersToOrders.attributes",
		"table",
		"table.hall",
		"place",
		"users"
	];

	private findOneRelations = [
		"usersToOrders",
		"usersToOrders.user",
		"usersToOrders.product",
		"usersToOrders.attributes",
		"table",
		"table.hall",
		"place",
		"users"
	];

	constructor(
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository,
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository,
		@InjectRepository(UserToOrderEntity) private readonly _userToOrderRepository,
		@InjectRepository(HistoryOrderEntity) private readonly _historyOrderRepository,
		@Inject(forwardRef(() => OrdersNotificationsService))
		private readonly _ordersNotificationService: OrdersNotificationsService,
		private readonly _orderGateway: OrdersGateway
	) {}

	async getOrder(id: string) {
		return this._ordersRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getOrders({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._ordersRepository.findAndCount({
			where: findOptions.where,
			relations: this.findRelations,
			take,
			skip
		});

		return {
			data,
			totalCount: count,
			page: skip / take + 1
		};
	}

	async getHistoryOrders({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._historyOrderRepository.findAndCount({
			where: findOptions.where,
			take,
			skip,
			relations: ["place"]
		});

		return {
			data,
			totalCount: count,
			page: skip / take + 1
		};
	}

	async creatOrder(order: CreateOrderInput, user: IUser): Promise<ActiveOrderEntity> {
		const savedOrder = await this._ordersRepository.save({
			...order,
			users: [{ id: user.id }],
			code: Math.floor(Math.random() * 9999)
		});

		await this._ordersNotificationService.createOrderEvent(savedOrder.id);

		return this._ordersRepository.findOne({
			where: { id: savedOrder.id },
			relations: this.findOneRelations
		});
	}

	async updateOrder(id: string, order: UpdateOrderDto | UpdateOrderInput): Promise<ActiveOrderEntity> {
		await this._ordersRepository.save({ id, ...order });

		return this._ordersRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async deleteOrder(id: string): Promise<string> {
		await this._ordersRepository.delete(id);
		return "DELETED";
	}

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
			await this._ordersNotificationService.addProductToOrderEvent(order.id, currProduct.id);
			await this.updateOrderTotalPrice(order.id);
			return result;
		}

		await this._ordersNotificationService.addProductToOrderEvent(order.id, productToOrder.productId);
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
			await this._ordersNotificationService.removeProductFromOrderEvent(order.id, deleteProduct.id);

			return this.updateOrderTotalPrice(order.id);
		}
		await this._userToOrderRepository.save({
			...deleteProduct,
			count: deleteProduct.count - 1
		});
		await this._ordersNotificationService.removeProductFromOrderEvent(order.id, deleteProduct.id);

		return this.updateOrderTotalPrice(order.id);
	}

	async addUserToOrder(code: number, user: IUser) {
		const currOrder = await this._ordersRepository.findOne({
			where: {
				code
			},
			relations: this.findOneRelations
		});

		if (!currOrder) {
			throw new GraphQLError(ErrorsEnum.OrderByCodeNotExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		await this._ordersNotificationService.addUserToOrderEvent(currOrder.id, user);

		return this._ordersRepository.save({
			...currOrder,
			users: [...currOrder.users, { id: user.id }]
		});
	}

	async closeOrder(orderId: string) {
		const order = await this._ordersRepository.findOne({
			where: { id: orderId },
			relations: this.findOneRelations
		});

		try {
			await this._historyOrderRepository.save({ ...order, place: { id: order.place.id } });
			await this._ordersRepository.delete(order.id);

			await this._ordersNotificationService.closeOrderEvent(orderId);

			return "ARCHIVED";
		} catch (error) {
			console.log("e", error);
			return "fuck!";
		}
	}

	async addTableToOrder(orderId: string, tableId: string) {
		await this._ordersNotificationService.addTableToOrderEvent(orderId, tableId);
		return this._ordersRepository.save({ id: orderId, table: { id: tableId } });
	}

	async removeTableFrom(orderId: string) {
		await this._ordersNotificationService.removeTableFromOrderEvent(orderId);
		return this._ordersRepository.save({ id: orderId, table: null });
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

	async updateOrderStatus(orderId: string, status: OrderStatusEnum) {
		const order = await this.getOrder(orderId);
		return this._ordersRepository.save({ ...order, status });
	}

	async updateUserProductToOrderStatus(uToId: string, status: ProductToOrderStatusEnum) {
		const uTo = await this._userToOrderRepository.findOne({ where: { id: uToId } });
		return this._userToOrderRepository.save({ ...uTo, status });
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

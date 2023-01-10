import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import { ErrorsEnum } from "../../shared/enums";
import { ActiveShiftEntity } from "../../shifts/entities";
import type { UpdateOrderDto } from "../dtos";
import type { CreateOrderInput, UpdateOrderInput } from "../dtos";
import type { CreateUserToOrderInput } from "../dtos";
import type { UpdateUserToOrderInput } from "../dtos";
import { ActiveOrderEntity, HistoryOrderEntity, UserToOrderEntity } from "../entities";
import { OrdersGateway } from "../gateways";
import { ORDER_CREATED } from "../gateways/events/order.event";

@Injectable()
export class OrdersService {
	private findRelations = [
		"usersToOrders",
		"usersToOrders.user",
		"usersToOrders.product",
		"usersToOrders.attributes",
		"table",
		"place",
		"users"
	];

	private findOneRelations = [
		"usersToOrders",
		"usersToOrders.user",
		"usersToOrders.product",
		"usersToOrders.attributes",
		"table",
		"place",
		"users"
	];

	constructor(
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository,
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository,
		@InjectRepository(UserToOrderEntity) private readonly _userToOrderRepository,
		@InjectRepository(HistoryOrderEntity) private readonly _historyOrderRepository,
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

	async creatOrder(order: CreateOrderInput): Promise<ActiveOrderEntity> {
		const savedOrder = await this._ordersRepository.save({
			...order,
			code: Math.floor(Math.random() * 9999)
		});

		const isWaitersPresent = order.table;

		const waiters = [];

		if (isWaitersPresent) {
			const activeShifts: ActiveShiftEntity[] = await this._shiftsRepository.find({
				where: {
					tables: {
						id: (order.table as any).id
					}
				},
				relations: ["tables", "waiter"]
			});

			for (const el of activeShifts) {
				waiters.push(el.waiter);
			}
		} else {
			const order: ActiveOrderEntity = await this._ordersRepository.findOne({
				where: { id: savedOrder.id },
				relations: ["place", "place.employees"]
			});

			for (const el of order.place.employees) {
				waiters.push(el);
			}
		}

		this._orderGateway.emitEvent(ORDER_CREATED, { savedOrder, waiters });

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

	async addProductToOrder(id: string, product: CreateUserToOrderInput): Promise<ActiveOrderEntity> {
		const currOrder = await this._ordersRepository.findOne({ where: { id }, relations: this.findRelations });

		const usersToOrders = [...(currOrder.usersToOrders?.length ? currOrder.usersToOrders : []), product];

		await this._ordersRepository.save({
			...currOrder,
			usersToOrders
		});

		const updatedOrder = await this._ordersRepository.findOne({ where: { id }, relations: this.findRelations });

		return this._ordersRepository.save({
			...updatedOrder,
			totalPrice: this.calculateTotalPrice([...updatedOrder.usersToOrders])
		});
	}

	async updateUserProductInOrder(product: UpdateUserToOrderInput) {
		const currProduct = await this._userToOrderRepository.findOne({ where: { id: product.id }, relations: ["order"] });

		const updatedProduct = currProduct.order.usersToOrders.find((el) => el.id === product.id);
		const updatedProducts = [...currProduct.order.usersToOrders, { id: updatedProduct, ...product }];

		await this._userToOrderRepository.save({ ...currProduct, product });
		await this._ordersRepository.save({ ...currProduct.order, totalPrice: this.calculateTotalPrice(updatedProducts) });
	}

	async removeUserProductInOrder(userToOrderProductId: string) {
		const order = await this._userToOrderRepository.findOne({
			where: { id: userToOrderProductId },
			relations: "order"
		});
		await this._userToOrderRepository.delete(userToOrderProductId);

		const updatedProducts = order.usersToOrders.filter((el) => el !== userToOrderProductId);

		await this._ordersRepository.save({ ...order, totalPrice: this.calculateTotalPrice(updatedProducts) });
		return "DELETED";
	}

	async addUserToOrder(code: number, userId: string) {
		const currOrder = await this._ordersRepository.findOne({
			where: {
				code
			},
			relations: this.findOneRelations
		});

		if (!currOrder) {
			throw new HttpException({ message: ErrorsEnum.OrderByCodeNotExist }, HttpStatus.NOT_FOUND);
		}

		return this._ordersRepository.save({
			...currOrder,
			users: [...currOrder.users, { id: userId }]
		});
	}

	async closeOrder(orderId: string) {
		const order = await this._ordersRepository.findOne({
			where: { id: orderId },
			relations: this.findOneRelations
		});

		try {
			console.log("order", order);
			await this._historyOrderRepository.save({ ...order, place: { id: order.place.id } });
			// await this._ordersRepository.delete(order.id);

			return "ARCHIVED";
		} catch (error) {
			console.log("e", error);
			return "fuck!";
		}
	}

	async addTableToOrder(orderId: string, tableId: string) {
		return this._ordersRepository.save({ id: orderId, table: { id: tableId } });
	}

	async removeTableFrom(orderId: string) {
		return this._ordersRepository.save({ id: orderId, table: null });
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

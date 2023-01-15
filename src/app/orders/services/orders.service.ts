import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as console from "console";
import { GraphQLError } from "graphql/error";

import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { ErrorsEnum, OrderStatusEnum, ProductToOrderStatusEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { ActiveShiftEntity } from "../../shifts/entities";
import type { CreateOrderInput, UpdateOrderDto, UpdateOrderInput } from "../dtos";
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

	async cancelOrder(orderId: string) {
		const order = await this._ordersRepository.findOne({
			where: { id: orderId },
			relations: this.findOneRelations
		});

		await this._ordersNotificationService.cancelOrderEvent(order);
		return this.archiveOrder({ ...order, status: OrderStatusEnum.CANCEL });
	}

	async closeOrder(orderId: string) {
		const order = await this._ordersRepository.findOne({
			where: { id: orderId },
			relations: this.findOneRelations
		});

		await this._ordersNotificationService.closeOrderEvent(orderId);
		return this.archiveOrder({ ...order, status: OrderStatusEnum.CLOSED });
	}

	async confirmOrder(orderId, user) {
		const productsToOrders: UserToOrderEntity[] = await this._userToOrderRepository.find({
			where: {
				order: {
					id: orderId
				},
				user: {
					id: user.id
				}
			},
			relations: ["order", "user"]
		});

		if (productsToOrders.length === 0) {
			throw new GraphQLError(ErrorsEnum.NoActiveProductsExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const updatedOrders = productsToOrders.map((el) => ({
			...el,
			status: ProductToOrderStatusEnum.WAITING_FOR_APPROVE
		}));
		await this._ordersNotificationService.confirmOrderEvent(orderId);
		return this._ordersRepository.save({ ...productsToOrders[0].order, usersToOrders: updatedOrders });
	}

	async archiveOrder(order: ActiveOrderEntity) {
		console.log("order", order);
		try {
			await this._historyOrderRepository.save({ ...order, place: { id: order.place.id } });
			await this._ordersRepository.delete(order.id);

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
}

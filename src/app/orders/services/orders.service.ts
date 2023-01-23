import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as console from "console";
import { GraphQLError } from "graphql/error";

import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { ErrorsEnum, OrderStatusEnum, OrderTypeEnum, ProductToOrderStatusEnum } from "../../shared/enums";
import { TableStatusEnum } from "../../shared/enums/orders/table-status.enum";
import type { IUser } from "../../shared/interfaces";
import { ActiveShiftEntity } from "../../shifts/entities";
import type { CreateOrderInput, UpdateOrderInput } from "../dtos";
import { ActiveOrderEntity, HistoryOrderEntity, ProductToOrderEntity } from "../entities";
import { OrdersGateway } from "../gateways";
import { OrdersNotificationsService } from "./orders.notifications.service";

@Injectable()
export class OrdersService {
	private findRelations = [
		"productsToOrders",
		"productsToOrders.user",
		"productsToOrders.product",
		"productsToOrders.attributes",
		"table",
		"table.hall",
		"place",
		"users"
	];

	private findOneRelations = [
		"productsToOrders",
		"productsToOrders.user",
		"productsToOrders.product",
		"productsToOrders.attributes",
		"table",
		"table.hall",
		"place",
		"users"
	];

	constructor(
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository,
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository,
		@InjectRepository(ProductToOrderEntity) private readonly productToOrderRepository,
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
		const date = new Date();

		const savedOrder: ActiveOrderEntity = await this._ordersRepository.save({
			...order,
			users: [{ id: user.id }],
			...(order.productsToOrder?.length
				? {
						productsToOrders: order.productsToOrder.map((el) => ({
							user: {
								id: user.id
							},
							count: el.count,
							product: el.product,
							attributes: el.attributes
						}))
				  }
				: {}),
			createdAt: date,
			startDate: date,
			code: Math.floor(Math.random() * 9999)
		});

		await this._ordersNotificationService.createOrderEvent(savedOrder.id);

		return this._ordersRepository.findOne({
			where: { id: savedOrder.id },
			relations: this.findOneRelations
		});
	}

	async updateOrder(id: string, order: UpdateOrderInput): Promise<ActiveOrderEntity> {
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
		const productsToOrders: ProductToOrderEntity[] = await this.productToOrderRepository.find({
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
			status: el.status === ProductToOrderStatusEnum.ADDED ? ProductToOrderStatusEnum.WAITING_FOR_APPROVE : el.status
		}));
		await this._ordersNotificationService.confirmOrderEvent(orderId);
		return this._ordersRepository.save({ ...productsToOrders[0].order, productsToOrders: updatedOrders });
	}

	async archiveOrder(order: ActiveOrderEntity) {
		try {
			await this._historyOrderRepository.save({ ...order, place: { id: order.place.id } });
			await this._ordersRepository.delete(order.id);

			return "ARCHIVED";
		} catch (error) {
			console.log("e", error);
		}
	}

	async addTableToOrder(orderId: string, tableId: string) {
		const order: ActiveOrderEntity = await this.getOrder(orderId);

		const inValidOrderDate =
			order.type !== OrderTypeEnum.IN_PLACE &&
			order.startDate.getMilliseconds() - new Date().getMilliseconds() > 60_000;
		if (inValidOrderDate) {
			throw new GraphQLError(ErrorsEnum.InvalidOrderDate.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		await this._ordersNotificationService.addTableToOrderEvent(orderId, tableId);
		return this._ordersRepository.save({
			id: orderId,
			table: { id: tableId },
			tableStatus:
				order.type === OrderTypeEnum.IN_PLACE ? TableStatusEnum.APPROVED : TableStatusEnum.WAITING_FOR_APPROVE
		});
	}

	async approveTableInOrder(orderId: string) {
		await this._ordersNotificationService.approveTableInOrderEvent(orderId);

		return this._ordersRepository.save({ id: orderId, tableStatus: TableStatusEnum.APPROVED });
	}

	async rejectTableInOrder(orderId: string) {
		await this._ordersNotificationService.rejectTableInOrderEvent(orderId);

		return this._ordersRepository.save({ id: orderId, tableStatus: TableStatusEnum.REJECTED });
	}

	async removeTableFrom(orderId: string) {
		await this._ordersNotificationService.removeTableFromOrderEvent(orderId);
		return this._ordersRepository.save({ id: orderId, table: null });
	}
}

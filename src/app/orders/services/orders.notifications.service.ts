import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UserToPlaceEntity } from "../../places/entities";
import { ProductsService } from "../../products/services";
import { UserRoleEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { ActiveShiftEntity } from "../../shifts/entities";
import { TablesService } from "../../tables/services";
import type { ProductToOrderEntity } from "../entities";
import { ActiveOrderEntity } from "../entities";
import { OrdersGateway } from "../gateways";
import { ORDERS_EVENTS } from "../gateways/events/order.event";
import { OrdersService } from "./orders.service";

@Injectable()
export class OrdersNotificationsService {
	constructor(
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository,
		@InjectRepository(UserToPlaceEntity) private readonly _uTpRepository,
		private readonly _orderGateway: OrdersGateway,
		@Inject(forwardRef(() => OrdersService)) private readonly _orderService: OrdersService,
		private readonly _productService: ProductsService,
		private readonly _tableService: TablesService
	) {}

	async createOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const waiters = await this.buildWaitersList(orderId);
		this._orderGateway.emitEvent(ORDERS_EVENTS.CREATED, { order, waiters });
	}

	async closeOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const waiters = await this.buildWaitersList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.CLOSED, { order, waiters });
	}

	async cancelOrderEvent(order: ActiveOrderEntity) {
		this._orderGateway.emitEvent(ORDERS_EVENTS.CANCELED, { order });
	}

	async rejectOrderEvent(order: ActiveOrderEntity, pTos: ProductToOrderEntity[]) {
		this._orderGateway.emitEvent(ORDERS_EVENTS.REJECTED, { order, pTos });
	}

	async approveOrderEvent(order: ActiveOrderEntity, pTos: ProductToOrderEntity[]) {
		this._orderGateway.emitEvent(ORDERS_EVENTS.APPROVED, { order, pTos });
	}

	async confirmOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const waiters = await this.buildWaitersList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.CONFIRM, { order, waiters });
	}

	async waitingForManualPayOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const waiters = await this.buildWaitersList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.WAITING_FOR_MANUAL_PAY, { order, waiters });
	}

	async addUserToOrderEvent(orderId: string, user: IUser) {
		const order = await this._orderService.getOrder(orderId);
		const waiters = await this.buildWaitersList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.USER_ADDED, { order, waiters, user });
	}

	async addTableToOrderEvent(orderId: string, tableId: string) {
		const order = await this._orderService.getOrder(orderId);
		const table = await this._tableService.getTable(tableId);
		const waiters = await this.buildWaitersList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.TABLE_ADDED, { order, waiters, table });
	}

	async approveTableInOrderEvent(orderId) {
		const order = await this._orderService.getOrder(orderId);
		this._orderGateway.emitEvent(ORDERS_EVENTS.TABLE_APPROVED, { order });
	}

	async rejectTableInOrderEvent(orderId) {
		const order = await this._orderService.getOrder(orderId);
		this._orderGateway.emitEvent(ORDERS_EVENTS.TABLE_REJECTED, { order });
	}

	async removeTableFromOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const waiters = await this.buildWaitersList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.TABLE_REMOVED, { order, waiters });
	}

	async buildWaitersList(orderId: string): Promise<IUser[]> {
		const order: ActiveOrderEntity = await this._orderService.getOrder(orderId);
		const waiters = [];

		if (order.table) {
			const activeShifts: ActiveShiftEntity[] = await this._shiftsRepository.find({
				where: {
					tables: {
						id: order.table.id
					}
				},
				relations: ["tables", "waiter"]
			});

			for (const el of activeShifts) {
				waiters.push(el.waiter);
			}
		} else {
			// const order: ActiveOrderEntity = await this._ordersRepository.findOne({
			// 	where: { id: orderId },
			// 	relations: ["place", "place.employees"]
			// });

			const uTps: UserToPlaceEntity[] = this._uTpRepository.find({
				where: {
					role: UserRoleEnum.WAITER,
					place: {
						id: order.place.id
					}
				}
			});

			for (const el of uTps) {
				waiters.push(el.user);
			}
		}

		return waiters;
	}
}

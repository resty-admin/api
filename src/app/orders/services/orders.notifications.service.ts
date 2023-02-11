import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not } from "typeorm";

import { UserToPlaceEntity } from "../../places/entities";
import { ProductsService } from "../../products/services";
import { UserRoleEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { ActiveShiftEntity } from "../../shifts/entities";
import { TablesService } from "../../tables/services";
import type { UserEntity } from "../../users/entities";
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
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.CREATED, { order, employees });
	}

	async closeOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.CLOSED, { order, employees });
	}

	async cancelOrderEvent(order: ActiveOrderEntity) {
		this._orderGateway.emitEvent(ORDERS_EVENTS.CANCELED, { order });
	}

	async rejectOrderPtosEvent(order: ActiveOrderEntity, pTos: ProductToOrderEntity[]) {
		this._orderGateway.emitEvent(ORDERS_EVENTS.PTO_REJECTED, { order, pTos });
	}

	async approveOrderPtosEvent(order: ActiveOrderEntity, pTos: ProductToOrderEntity[]) {
		this._orderGateway.emitEvent(ORDERS_EVENTS.PTO_APPROVED, { order, pTos });
	}

	async confirmOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.CONFIRM, { order, employees });
	}

	async waitingForManualPayOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.WAITING_FOR_MANUAL_PAY, { order, employees });
	}

	async addUserToOrderEvent(orderId: string, user: IUser) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.USER_ADDED, { order, employees, user });
	}

	async addTableToOrderEvent(orderId: string, tableId: string) {
		const order = await this._orderService.getOrder(orderId);
		const table = await this._tableService.getTable(tableId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.TABLE_ADDED, { order, employees, table });
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
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.TABLE_REMOVED, { order, employees });
	}

	async buildEmployeesList(orderId: string): Promise<UserEntity[]> {
		const order: ActiveOrderEntity = await this._orderService.getOrder(orderId);

		if (order.waiters) {
			return order.waiters;
		}

		const otherWorkers: UserToPlaceEntity[] = await this._uTpRepository.find({
			where: {
				place: {
					id: order.place.id
				},
				user: {
					role: Not(UserRoleEnum.CLIENT)
				}
			}
		});

		return this.findExistedWorkersByPriority(otherWorkers);
	}

	private findExistedWorkersByPriority(fetchedWorkers: UserToPlaceEntity[]) {
		const existedWorkers = [];
		// const roles = [UserRoleEnum.WAITER, UserRoleEnum.HOSTESS, UserRoleEnum.MANAGER];
		const roles = [UserRoleEnum.WAITER, UserRoleEnum.HOSTESS];
		let tmp = UserRoleEnum.HOSTESS;

		for (const [idx, _] of roles.entries()) {
			if (existedWorkers.length > 0) {
				return;
			}

			for (const fetchedWorker of fetchedWorkers) {
				if (fetchedWorker.user.role === tmp) {
					existedWorkers.push(fetchedWorker.user);
				}
			}

			if (existedWorkers.length === 0) {
				tmp = roles[idx + 1];
			}
		}
		return existedWorkers;
	}
}

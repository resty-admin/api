import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";

import { COMMAND_EMITTED } from "../../gateways/events";
import { UserToPlaceEntity } from "../../places/entities";
import { ProductsService } from "../../products/services";
import { ProductToOrderStatusEnum, UserRoleEnum } from "../../shared/enums";
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
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository: Repository<ActiveShiftEntity>,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>,
		@InjectRepository(UserToPlaceEntity) private readonly _uTpRepository: Repository<UserToPlaceEntity>,
		private readonly _orderGateway: OrdersGateway,
		@Inject(forwardRef(() => OrdersService)) private readonly _orderService: OrdersService,
		private readonly _productService: ProductsService,
		private readonly _tableService: TablesService
	) {}

	async createOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.CREATED, { ...order, pTos: order.productsToOrders, employees });
	}

	async cancelOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.CANCELED, { ...order, employees });
	}

	async requestToConfirmOrderEvent(orderId) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.REQUEST_TO_CONFIRM, { ...order, employees });
	}

	async emitOrderCommand(orderId, command) {
		this._orderGateway.emitEvent(COMMAND_EMITTED, command);
	}

	async closeOrderEvent(order: ActiveOrderEntity) {
		const currOrder = await this._orderService.getOrder(order.id);
		const employees = await this.buildEmployeesList(order.id);
		this._orderGateway.emitEvent(ORDERS_EVENTS.CLOSED, { ...currOrder, employees });
	}

	async rejectOrderPtosEvent(order: ActiveOrderEntity, pTos: ProductToOrderEntity[]) {
		this._orderGateway.emitEvent(ORDERS_EVENTS.PTO_REJECTED, { ...order, pTos });
	}

	async approveOrderPtosEvent(order: ActiveOrderEntity, pTos: ProductToOrderEntity[]) {
		this._orderGateway.emitEvent(ORDERS_EVENTS.PTO_APPROVED, { ...order, pTos });
	}

	async waitingForManualPayOrderEvent(orderId: string, pTos: ProductToOrderEntity[]) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.WAITING_FOR_MANUAL_PAY, { ...order, pTos, employees });
	}

	async manualPaymentSuccessEvent(order: ActiveOrderEntity) {
		this._orderGateway.emitEvent(ORDERS_EVENTS.MANUAL_PAYMENT_SUCCESS, { ...order });
	}

	async confirmOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);

		const employees = await this.buildEmployeesList(orderId);

		const pTos = order.productsToOrders.filter((el) => el.status === ProductToOrderStatusEnum.WAITING_FOR_APPROVE);
		this._orderGateway.emitEvent(ORDERS_EVENTS.CONFIRM, { ...order, pTos, employees });
	}

	async paymentSuccessOrderEvent(orderId: string, pTos: ProductToOrderEntity[]) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.PAYMENT_SUCCESS, { ...order, pTos, employees });
	}

	async addUserToOrderEvent(orderId: string, user: IUser) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.USER_ADDED, { ...order, employees, user });
	}

	async addTableToOrderEvent(orderId: string, tableId: string) {
		const order = await this._orderService.getOrder(orderId);
		const table = await this._tableService.getTable(tableId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.TABLE_ADDED, { ...order, employees, table });
	}

	async approveOrderEvent(orderId) {
		const order = await this._orderService.getOrder(orderId);
		this._orderGateway.emitEvent(ORDERS_EVENTS.APPROVED, { ...order });
	}

	async rejectOrderEvent(orderId) {
		const order = await this._orderService.getOrder(orderId);
		this._orderGateway.emitEvent(ORDERS_EVENTS.REJECTED, { ...order });
	}

	async removeTableFromOrderEvent(orderId: string) {
		const order = await this._orderService.getOrder(orderId);
		const employees = await this.buildEmployeesList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.TABLE_REMOVED, { ...order, employees });
	}

	async buildEmployeesList(orderId: string): Promise<UserEntity[]> {
		const order: ActiveOrderEntity = await this._orderService.getOrder(orderId);

		if (order.waiters.length > 0) {
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
			},
			relations: ["user"]
		});

		return this.findExistedWorkersByPriority(otherWorkers);
	}

	private findExistedWorkersByPriority(fetchedWorkers: UserToPlaceEntity[]) {
		const existedWorkers = [];
		// const roles = [UserRoleEnum.WAITER, UserRoleEnum.HOSTESS, UserRoleEnum.MANAGER];
		const roles = [UserRoleEnum.WAITER, UserRoleEnum.HOSTESS];
		let tmp = UserRoleEnum.WAITER;

		for (const [idx, _] of roles.entries()) {
			if (existedWorkers.length > 0) {
				return existedWorkers;
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

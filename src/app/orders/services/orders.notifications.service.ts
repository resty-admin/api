import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ProductsService } from "../../products/services";
import type { IUser } from "../../shared/interfaces";
import { ActiveShiftEntity } from "../../shifts/entities";
import { TablesService } from "../../tables/services";
import { ActiveOrderEntity } from "../entities";
import { OrdersGateway } from "../gateways";
import { ORDERS_EVENTS } from "../gateways/events/order.event";
import { OrdersService } from "./orders.service";

@Injectable()
export class OrdersNotificationsService {
	constructor(
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository,
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

	async addUserToOrderEvent(orderId: string, user: IUser) {
		const order = await this._orderService.getOrder(orderId);
		const waiters = await this.buildWaitersList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.USER_ADDED, { order, waiters, user });
	}

	async addProductToOrderEvent(orderId: string, productId: string) {
		const order = await this._orderService.getOrder(orderId);
		const product = await this._productService.getProduct(productId);
		console.log("p", product);
		const waiters = await this.buildWaitersList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.PRODUCT_ADDED, { order, waiters, product });
	}

	async removeProductFromOrderEvent(orderId: string, productId: string) {
		const order = await this._orderService.getOrder(orderId);
		const product = await this._productService.getProduct(productId);
		const waiters = await this.buildWaitersList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.PRODUCT_REMOVED, { order, waiters, product });
	}

	async addTableToOrderEvent(orderId: string, tableId: string) {
		const order = await this._orderService.getOrder(orderId);
		const table = await this._tableService.getTable(tableId);
		const waiters = await this.buildWaitersList(orderId);

		this._orderGateway.emitEvent(ORDERS_EVENTS.TABLE_ADDED, { order, waiters, table });
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
			const order: ActiveOrderEntity = await this._ordersRepository.findOne({
				where: { id: orderId },
				relations: ["place", "place.employees"]
			});

			for (const el of order.place.employees) {
				waiters.push(el);
			}
		}

		return waiters;
	}
}

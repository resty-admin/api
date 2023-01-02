import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateOrderDto, UpdateOrderDto } from "../dtos";
import type { CreateOrderInput, UpdateOrderInput } from "../dtos";
import { ActiveOrderEntity } from "../entities";

@Injectable()
export class OrdersService {
	private findRelations = ["users", "table", "place"];
	private findOneRelations = ["users", "table", "place"];

	constructor(@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository) {}

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

	async creatOrder(order: CreateOrderDto | CreateOrderInput): Promise<ActiveOrderEntity> {
		const savedOrder = await this._ordersRepository.save({ ...order, place: { id: order.place } });

		return this._ordersRepository.findOne({
			where: { id: savedOrder.id }
		});
	}

	async updateOrder(id: string, user: UpdateOrderDto | UpdateOrderInput): Promise<ActiveOrderEntity> {
		return this._ordersRepository.save({ id, ...user });
	}

	async deleteOrder(id: string): Promise<string> {
		await this._ordersRepository.delete(id);
		return "DELETED";
	}
}

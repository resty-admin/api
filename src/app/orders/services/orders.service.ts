import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateOrderDto, UpdateOrderDto } from "../dtos";
import { ActiveOrderEntity } from "../entities";

@Injectable()
export class OrdersService {
	constructor(@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository) {}

	async getOrder(id: string) {
		return this._ordersRepository.findOne({
			where: { id }
		});
	}

	async getOrders({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

		const [data, count] = await this._ordersRepository.findAndCount({
			where: findOptions.where,
			take,
			skip
		});

		return {
			data,
			totalCount: count,
			page: skip / take + 1
		};
	}

	async creatOrder(order: CreateOrderDto): Promise<ActiveOrderEntity> {
		const savedOrder = await this._ordersRepository.save(order);

		return this._ordersRepository.findOne({
			where: { id: savedOrder.id }
		});
	}

	async updateOrder(id: string, user: UpdateOrderDto): Promise<ActiveOrderEntity> {
		return this._ordersRepository.save({ id, ...user });
	}

	async deleteOrder(id: string): Promise<string> {
		await this._ordersRepository.delete(id);
		return "DELETED";
	}
}

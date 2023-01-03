import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { UpdateOrderDto } from "../dtos";
import type { CreateOrderInput, UpdateOrderInput } from "../dtos";
import type { CreateUserToOrderInput } from "../dtos";
import type { UpdateUserToOrderInput } from "../dtos";
import { ActiveOrderEntity, UserToOrderEntity } from "../entities";

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
		@InjectRepository(UserToOrderEntity) private readonly _userToOrderRepository
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

	async creatOrder(order: CreateOrderInput): Promise<ActiveOrderEntity> {
		const savedOrder = await this._ordersRepository.save({
			...order
		});

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

		return this._ordersRepository.save({
			...currOrder,
			usersToOrders: [...(currOrder.usersToOrders?.length ? currOrder.usersToOrders : []), product]
		});
	}

	async updateUserProductInOrder(product: UpdateUserToOrderInput) {
		await this._userToOrderRepository.findOne({ where: { id: product.id } });
		return this._userToOrderRepository.save(product);
	}

	async removeUserProductInOrder(userToOrderProductId: string) {
		await this._userToOrderRepository.delete(userToOrderProductId);
		return "DELETED";
	}
}

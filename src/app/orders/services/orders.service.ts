import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import { ErrorsEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { ActiveShiftEntity } from "../../shifts/entities";
import type { UpdateOrderDto } from "../dtos";
import type { CreateOrderInput, UpdateOrderInput } from "../dtos";
import type { RemoveProductFromOrderInput } from "../dtos";
import type { AddProductToOrderInput } from "../dtos/add-product-to-order.dto";
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
		console.log("gere?");
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

	async addProductToOrder(productToOrder: AddProductToOrderInput, user: IUser) {
		const order: ActiveOrderEntity = await this._ordersRepository.findOne({
			where: {
				id: productToOrder.orderId
			},
			relations: ["usersToOrders", "usersToOrders.product", "usersToOrders.attributes", "usersToOrders.user"]
		});

		const currProduct: UserToOrderEntity = order.usersToOrders.find((order) => {
			const attrsForUpdateExist = productToOrder.attrs?.length > 0;
			const attrsInCurrentOrderExist = order.attributes?.length > 0;
			return (
				order.user.id === user.id &&
				order.product.id === productToOrder.productId &&
				(attrsForUpdateExist && attrsInCurrentOrderExist
					? order.attributes.filter((el) => productToOrder.attrs.includes(el.id)).length === productToOrder.attrs.length
					: !attrsForUpdateExist)
			);
		});

		if (currProduct) {
			return this._userToOrderRepository.save({ ...currProduct, count: currProduct.count + 1 });
		}

		return this._userToOrderRepository.save({
			order: {
				id: productToOrder.orderId
			},
			product: {
				id: productToOrder.productId
			},
			user: {
				id: user.id
			},
			count: 1,
			...(productToOrder.attrs?.length > 0 ? { attributes: productToOrder.attrs.map((id) => ({ id })) } : {})
		});
	}

	async removeProductFromOrder(productFromOrder: RemoveProductFromOrderInput, user: IUser) {
		const order: ActiveOrderEntity = await this._ordersRepository.findOne({
			where: {
				id: productFromOrder.orderId,
				usersToOrders: {
					user: {
						id: user.id
					}
				}
			},
			relations: ["usersToOrders", "usersToOrders.product", "usersToOrders.attributes", "usersToOrders.user"]
		});

		const deleteProduct = order.usersToOrders.find(
			(el) =>
				el.user.id === user.id &&
				el.product.id === productFromOrder.productId &&
				(productFromOrder.attrs?.length > 0
					? el.attributes?.filter((el) => productFromOrder.attrs.includes(el.id)).length ===
					  productFromOrder.attrs.length
					: el.attributes?.length === 0)
		);

		if (deleteProduct.count === 1) {
			await this._userToOrderRepository.delete(deleteProduct.id);
			return "PRODUCT DELETED";
		}
		await this._userToOrderRepository.save({
			...deleteProduct,
			count: deleteProduct.count - 1
		});

		return "PRODUCT COUNT DECREASED";
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

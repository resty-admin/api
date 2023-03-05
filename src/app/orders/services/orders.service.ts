import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as console from "console";
import { GraphQLError } from "graphql/error";
import { In, Repository } from "typeorm";

import { PlaceEntity, UserToPlaceEntity } from "../../places/entities";
import { getFindOptionsByFilters } from "../../shared";
import { getFindOptionsJsonUtil } from "../../shared/crud/utils/get-find-options-json.util";
import type { FiltersArgsDto, PaginationArgsDto } from "../../shared/dtos";
import { ErrorsEnum, OrderStatusEnum, OrderTypeEnum, ProductToOrderStatusEnum, UserRoleEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { ActiveShiftEntity } from "../../shifts/entities";
import { UserEntity } from "../../users/entities";
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
		"productsToOrders.attributesToProduct",
		"table",
		"table.hall",
		"place",
		"place.company",
		"place.paymentSystems",
		"waiters",
		"users"
	];

	private findOneRelations = [
		"productsToOrders",
		"productsToOrders.user",
		"productsToOrders.product",
		"productsToOrders.attributesToProduct",
		"productsToOrders.attributesToProduct.attribute",
		"table",
		"table.hall",
		"place",
		"place.company",
		"place.paymentSystems",
		"waiters",
		"users"
	];

	constructor(
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>,
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository: Repository<ActiveShiftEntity>,
		@InjectRepository(ProductToOrderEntity) private readonly productToOrderRepository: Repository<ProductToOrderEntity>,
		@InjectRepository(HistoryOrderEntity) private readonly _historyOrderRepository: Repository<HistoryOrderEntity>,
		@InjectRepository(UserToPlaceEntity) private readonly _uTpRepository: Repository<UserToPlaceEntity>,
		@InjectRepository(PlaceEntity) private readonly _placeRepository: Repository<PlaceEntity>,
		@InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>,
		@Inject(forwardRef(() => OrdersNotificationsService))
		private readonly _ordersNotificationService: OrdersNotificationsService,
		private readonly _orderGateway: OrdersGateway
	) {}

	async getOrder(id: string, filtersArgs?: FiltersArgsDto[]) {
		const findOptions: any = filtersArgs ? getFindOptionsByFilters(filtersArgs) : { where: { id } };

		return this._ordersRepository.findOne({
			where: findOptions.where,
			relations: this.findOneRelations
		});
	}

	async getOrders({ take, skip, filtersArgs }: PaginationArgsDto, user: IUser) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._ordersRepository.findAndCount({
			where: {
				...findOptions.where,
				...(user.role === UserRoleEnum.ADMIN
					? {}
					: user.role === UserRoleEnum.MANAGER
					? {
							place: {
								company: {
									owner: {
										id: user.id
									}
								}
							}
					  }
					: user.role === UserRoleEnum.CLIENT
					? {
							users: {
								id: user.id
							}
					  }
					: {
							waiters: {
								id: user.id
							}
					  })
			},
			relations: this.findRelations,
			take,
			skip
		});

		if (data.length === 0 && user.role === UserRoleEnum.WAITER) {
			const uTp = await this._uTpRepository.findOne({
				where: {
					user: {
						id: user.id
					}
				},
				relations: ["place"]
			});

			const [data, count] = await this._ordersRepository.findAndCount({
				where: {
					place: {
						id: uTp.place.id
					}
				},
				take,
				skip,
				relations: this.findRelations
			});

			return {
				data,
				totalCount: count,
				page: skip / take + 1
			};
		}

		return {
			data,
			totalCount: count,
			page: skip / take + 1
		};
	}

	async getHistoryOrders(placeId: string, { take, skip, filtersArgs }: PaginationArgsDto) {
		const repoBuilder = this._historyOrderRepository
			.createQueryBuilder("order")
			.innerJoinAndSelect("order.place", "place")
			.where("place.id = :id", { id: placeId });

		const builder = getFindOptionsJsonUtil(filtersArgs, repoBuilder, "order");

		const data = await builder.take(take).skip(skip).getMany();

		return {
			data,
			totalCount: data.length,
			page: skip / take + 1
		};
	}

	async clientHistoryOrders(user: IUser, { take, skip }: PaginationArgsDto) {
		const repoBuilder = this._historyOrderRepository
			.createQueryBuilder("order")
			.innerJoinAndSelect("order.place", "place")
			.where("order.users @> :users", {
				users: JSON.stringify([{ id: user.id }])
			});

		const data = await repoBuilder.take(take).skip(skip).getMany();

		return {
			data,
			totalCount: data.length,
			page: skip / take + 1
		};
	}

	async clientHistoryOrder(user: IUser, orderId: string) {
		const repoBuilder = this._historyOrderRepository
			.createQueryBuilder("order")
			.innerJoinAndSelect("order.place", "place")
			.where("order.id = :orderId", { orderId })
			.andWhere("order.users @> :users", {
				users: JSON.stringify([{ id: user.id }])
			});

		return repoBuilder.getOne();
	}

	async createOrder(order: CreateOrderInput, user: IUser): Promise<ActiveOrderEntity> {
		const date = "startDate" in order ? new Date(order.startDate) : new Date();

		if (order.type !== OrderTypeEnum.IN_PLACE && !(await this.isTimeAvailable(date, order.place.id))) {
			throw new GraphQLError(ErrorsEnum.InvalidOrderDate.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const waiters = await this.createWaitersForInPlaceOrder(order);

		const savedOrder = await this._ordersRepository.save({
			...order,
			waiters,
			users: [{ id: user.id }],
			status: order.type === OrderTypeEnum.IN_PLACE ? OrderStatusEnum.CREATED : OrderStatusEnum.REQUEST_TO_CONFIRM,
			...(order.productsToOrder?.length
				? {
						productsToOrders: order.productsToOrder.map((el) => ({
							user: {
								id: user.id
							},
							count: el.count,
							product: el.productId,
							attributesToProduct: Object.entries(
								(el.attributesIds || []).reduce(
									(pre, curr) => ({
										...pre,
										[curr.id]: pre[curr.id] ? pre[curr.id] + 1 : 1
									}),
									{}
								)
							).map(([id, count]) => ({ attribute: { id }, count })),
							status: ProductToOrderStatusEnum.WAITING_FOR_APPROVE
						}))
				  }
				: {}),
			createdAt: date,
			startDate: date,
			code: Math.floor(1000 + Math.random() * 9000)
		} as ActiveOrderEntity);

		await this._ordersNotificationService.createOrderEvent(savedOrder.id);

		return this._ordersRepository.findOne({
			where: { id: savedOrder.id },
			relations: this.findOneRelations
		});
	}

	async updateOrder(id: string, order: UpdateOrderInput): Promise<ActiveOrderEntity> {
		await this._ordersRepository.save({ id, status: OrderStatusEnum.REQUEST_TO_CONFIRM, ...order });

		await this._ordersNotificationService.requestToConfirmOrderEvent(order.id);

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
		const order = await this._ordersRepository
			.findOne({
				where: { id: orderId },
				relations: this.findOneRelations
			})
			.catch(() => {
				throw new GraphQLError(ErrorsEnum.AlreadyArchived.toString(), {
					extensions: {
						code: 500
					}
				});
			});

		await this._ordersNotificationService.cancelOrderEvent(order.id);
		return this.archiveOrder({ ...order, status: OrderStatusEnum.CANCEL } as ActiveOrderEntity);
	}

	async closeOrder(orderId: string) {
		const order = await this._ordersRepository
			.findOne({
				where: { id: orderId },
				relations: this.findOneRelations
			})
			.catch(() => {
				throw new GraphQLError(ErrorsEnum.AlreadyArchived.toString(), {
					extensions: {
						code: 500
					}
				});
			});

		await this._ordersNotificationService.closeOrderEvent(order);
		return this.archiveOrder({ ...order, status: OrderStatusEnum.CLOSED } as ActiveOrderEntity);
	}

	// async confirmOrder(orderId, user) {
	// 	const productsToOrders: ProductToOrderEntity[] = await this.productToOrderRepository.find({
	// 		where: {
	// 			order: {
	// 				id: orderId
	// 			},
	// 			user: {
	// 				id: user.id
	// 			}
	// 		},
	// 		relations: ["order", "user"]
	// 	});
	//
	// 	if (productsToOrders.length === 0) {
	// 		throw new GraphQLError(ErrorsEnum.NoActiveProductsExist.toString(), {
	// 			extensions: {
	// 				code: 500
	// 			}
	// 		});
	// 	}
	//
	// 	const updatedOrders = productsToOrders.map((el) => ({
	// 		...el,
	// 		status: el.status === ProductToOrderStatusEnum.ADDED ? ProductToOrderStatusEnum.WAITING_FOR_APPROVE : el.status
	// 	}));
	// 	await this._ordersNotificationService.confirmOrderEvent(orderId);
	// 	return this._ordersRepository.save({ ...productsToOrders[0].order, productsToOrders: updatedOrders });
	// }

	async archiveOrder(order: ActiveOrderEntity) {
		try {
			const users = await this._userRepository.find({
				where: {
					id: In(order.users.map((el) => el.id))
				}
			});

			for (const user of users) {
				const userExist = await this._uTpRepository.findOne({
					where: {
						user: {
							id: user.id
						}
					},
					relations: ["user"]
				});

				await (userExist
					? this._uTpRepository.save({ ...userExist, visits: ++userExist.visits })
					: this._uTpRepository.save({ place: { id: order.place.id }, user, role: UserRoleEnum.CLIENT, visits: 1 }));
			}

			await this._historyOrderRepository.save({ ...order, place: { id: order.place.id } });
			await this._ordersRepository.delete(order.id);

			return "ARCHIVED";
		} catch (error) {
			console.error("e", error);
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
			status: OrderStatusEnum.REQUEST_TO_CONFIRM
		});
	}

	async approveOrder(orderId: string) {
		await this._ordersNotificationService.approveOrderEvent(orderId);

		return this._ordersRepository.save({ id: orderId, status: OrderStatusEnum.APPROVED });
	}

	async rejectOrder(orderId: string) {
		await this._ordersNotificationService.rejectOrderEvent(orderId);

		return this._ordersRepository.save({ id: orderId, status: OrderStatusEnum.REJECTED });
	}

	async removeTableFrom(orderId: string) {
		await this._ordersNotificationService.removeTableFromOrderEvent(orderId);
		return this._ordersRepository.save({ id: orderId, table: null });
	}

	async createWaitersForInPlaceOrder(order: CreateOrderInput) {
		if (order.type !== OrderTypeEnum.IN_PLACE) {
			return [];
		}

		const tableShifts: ActiveShiftEntity[] = await this._shiftsRepository.find({
			where: {
				tables: {
					id: In([(order.table as unknown as { id: string }).id])
				}
			}
		});

		return tableShifts.map((el) => el.waiter);
	}

	async isTimeAvailable(date: Date, placeId: string) {
		if (date <= new Date()) {
			throw new GraphQLError(ErrorsEnum.TimeNotAvailable.toString(), {
				extensions: {
					code: 500
				}
			});
		}
		const place = await this._placeRepository.findOne({
			where: {
				id: placeId
			}
		});

		const isHoliday = place.holidayDays[new Date().toISOString().split("T")[0]];
		const orderHours = date.getHours();

		if (isHoliday) {
			return Number(isHoliday.start) <= orderHours && Number(isHoliday.end) >= orderHours;
		}

		const isWeekDay = date.getDay() <= 5 && date.getDay() !== 0;
		const start = Number(place[isWeekDay ? "weekDays" : "weekendDays"].start);
		const end = Number(place[isWeekDay ? "weekDays" : "weekendDays"].end);

		const isAvailable = orderHours >= start && orderHours <= end;

		if (!isAvailable) {
			throw new GraphQLError(ErrorsEnum.TimeNotAvailable.toString(), {
				extensions: {
					code: 500
				}
			});
		}
		return isAvailable;
	}
}

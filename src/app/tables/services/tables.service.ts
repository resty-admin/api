import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { Between, In } from "typeorm";

import { ActiveOrderEntity } from "../../orders/entities";
import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import { ErrorsEnum, OrderStatusEnum, OrderTypeEnum } from "../../shared/enums";
import type { CreateTableDto, CreateTableInput, UpdateTableDto, UpdateTableInput } from "../dtos";
import { TableEntity } from "../entities";

@Injectable()
export class TablesService {
	private findRelations = ["hall", "orders", "file"];
	private findOneRelations = ["hall", "orders", "file"];

	constructor(
		@InjectRepository(TableEntity) private readonly _tablesRepository,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository
	) {}

	async getTable(id: string) {
		return this._tablesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getTables({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._tablesRepository.findAndCount({
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

	async createTable(table: CreateTableDto | CreateTableInput): Promise<TableEntity> {
		const savedTable = await this._tablesRepository.save({ ...table, hall: { id: table.hall } });

		return this._tablesRepository.findOne({
			where: { id: savedTable.id }
		});
	}

	async updateTable(id: string, table: UpdateTableDto | UpdateTableInput): Promise<TableEntity> {
		await this._tablesRepository.save({ id, ...table });

		return this._tablesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async deleteTable(id: string): Promise<string> {
		const orders: ActiveOrderEntity[] = await this._ordersRepository.find({
			where: {
				table: { id }
			},
			relations: ["table"]
		});

		const isActiveOrdersPresent = orders.some((el) => el.status !== OrderStatusEnum.CLOSED);

		if (isActiveOrdersPresent) {
			await this._tablesRepository.save({ id, isHide: true });

			return `Table is using in active order(s). Table will be hide for now`;
		}

		await this._tablesRepository.delete(id);
		return `${id} deleted`;
	}

	async getTableByCode(code: string, placeId: string) {
		const table = await this._tablesRepository.findOne({
			where: {
				code,
				hall: {
					place: {
						id: placeId
					}
				}
			},
			relations: ["hall", "hall.place"]
		});

		if (!table) {
			throw new GraphQLError(ErrorsEnum.IncorrectTableCode.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const activeOrders: ActiveOrderEntity[] = await this._ordersRepository.find({
			where: {
				table: {
					id: table.id
				}
			},
			relations: ["table"]
		});

		if (activeOrders.length === 0) {
			return table;
		}

		const inPlaceActiveOrder = activeOrders.some((el) => el.type === OrderTypeEnum.IN_PLACE);
		const closeReserve = activeOrders.some((el) => {
			const currDate = new Date().getMilliseconds();
			const ONE_HOUR = 3_600_000;
			const orderStartTime = el.startDate.getMilliseconds();

			return orderStartTime - currDate < ONE_HOUR;
		});

		if (inPlaceActiveOrder || closeReserve) {
			throw new GraphQLError(ErrorsEnum.ActiveInPlaceOrderWithTableExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}
	}

	async isTableAvailableForReserve(tableId: string, date: Date) {
		const ONE_HOUR_S = 3600;
		const minFreeDate = new Date((date.getTime() / 1000 - ONE_HOUR_S) * 1000);
		const maxFreeDate = new Date((date.getTime() / 1000 + ONE_HOUR_S) * 1000);

		const activeOrders: ActiveOrderEntity[] = await this._ordersRepository.find({
			where: {
				table: {
					id: tableId
				},
				type: In([OrderTypeEnum.IN_PLACE, OrderTypeEnum.RESERVE]),
				startDate: Between(minFreeDate, maxFreeDate)
			},
			relations: ["table"]
		});

		if (activeOrders.length === 0) {
			return this.getTable(tableId);
		}

		throw new GraphQLError(ErrorsEnum.TableAlreadyReserved.toString(), {
			extensions: {
				code: 500
			}
		});
	}
}

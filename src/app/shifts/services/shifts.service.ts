import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import type { DeepPartial } from "typeorm";
import { Between, Repository } from "typeorm";

import { ActiveOrderEntity } from "../../orders/entities";
import { OrdersNotificationsService } from "../../orders/services";
import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { FiltersArgsDto } from "../../shared/dtos";
import { ErrorsEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import type { CreateShiftInput, UpdateShiftInput } from "../dtos";
import { ActiveShiftEntity } from "../entities";
import { HistoryShiftEntity } from "../entities/history-shift.entity";

@Injectable()
export class ShiftsService {
	private findRelations = ["tables", "tables.hall", "waiter", "place"];
	private findOneRelations = ["tables", "tables.hall", "waiter", "place"];

	constructor(
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository: Repository<ActiveShiftEntity>,
		@InjectRepository(HistoryShiftEntity) private readonly _historyShiftsRepository: Repository<HistoryShiftEntity>,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>,
		private readonly _ordersNotificationService: OrdersNotificationsService
	) {}

	async getShift(filtersArgs: FiltersArgsDto[]) {
		const findOptions = filtersArgs?.length > 0 ? getFindOptionsByFilters(filtersArgs) : ([] as any);

		return this._shiftsRepository.findOne({
			where: {
				...findOptions.where
			},
			relations: this.findOneRelations
		});
	}

	async getShifts({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._shiftsRepository.findAndCount({
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

	async getActiveShift(id: string) {
		return this._shiftsRepository.findOne({
			where: {
				waiter: {
					id
				}
			},
			relations: this.findOneRelations
		});
	}

	async createShift(shift: CreateShiftInput, user: IUser) {
		const shiftPresent = await this._shiftsRepository.findOne({
			where: { waiter: { id: user.id } },
			relations: ["waiter"]
		});

		if (shiftPresent) {
			throw new GraphQLError(ErrorsEnum.ActiveShiftExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}
		const savedShift = await this._shiftsRepository.save({
			...shift,
			waiter: { id: user.id }
		} as DeepPartial<ActiveShiftEntity>);

		const startDate = new Date(new Date().setHours(6, 0, 0));
		const endDate = new Date(new Date().setHours(24, 0, 0));

		const orders = await this._ordersRepository.find({
			where: {
				startDate: Between(startDate, endDate),
				place: {
					id: shift.place
				}
			}
		});

		if (orders.length > 0) {
			await this._ordersRepository.save(
				orders.map((o) => ({
					...o,
					waiters: [{ id: user.id }]
				}))
			);
			for (const o of orders) {
				await this._ordersNotificationService.createOrderEvent(o.id);
			}
		}

		return this._shiftsRepository.findOne({
			where: { id: savedShift.id }
		});
	}

	async closeShift(id: string) {
		const shift: ActiveShiftEntity = await this._shiftsRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});

		try {
			await this._historyShiftsRepository.save({ ...shift, shiftDateStart: shift.shiftDate } as any);
			await this._shiftsRepository.delete(id);

			return "ARCHIVED";
		} catch (error) {
			console.error("e", error);
			return "fuck!";
		}
	}

	async updateShift(id: string, shift: UpdateShiftInput): Promise<ActiveShiftEntity> {
		return this._shiftsRepository.save({ id, ...shift });
	}

	async deleteShift(id: string): Promise<string> {
		await this._shiftsRepository.delete(id);
		return "DELETED";
	}
}

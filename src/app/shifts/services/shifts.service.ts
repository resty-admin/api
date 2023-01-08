import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { IUser } from "../../shared/interfaces";
import type { CreateShiftDto, UpdateShiftDto } from "../dtos";
import type { CreateShitInput, UpdateShitInput } from "../dtos";
import { ActiveShiftEntity } from "../entities";
import { HistoryShiftEntity } from "../entities/history-shift.entity";

@Injectable()
export class ShiftsService {
	private findRelations = ["tables", "tables.orders", "waiter", "place"];
	private findOneRelations = ["tables", "tables.orders", "waiter", "place"];

	constructor(
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository,
		@InjectRepository(HistoryShiftEntity) private readonly _historyShiftsRepository
	) {}

	async getShift(id: string) {
		return this._shiftsRepository.findOne({
			where: { id },
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

	async createShift(shift: CreateShiftDto | CreateShitInput, user: IUser): Promise<ActiveShiftEntity> {
		const savedShift = await this._shiftsRepository.save({
			...shift,
			waiter: { id: user.id }
		});

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
			await this._historyShiftsRepository.save({ ...shift, shiftDateStart: shift.shiftDate });
			await this._shiftsRepository.delete(id);

			return "ARCHIVED";
		} catch (error) {
			console.log("e", error);
			return "fuck!";
		}
	}

	async updateShift(id: string, shift: UpdateShiftDto | UpdateShitInput): Promise<ActiveShiftEntity> {
		return this._shiftsRepository.save({ id, ...shift });
	}

	async deleteShift(id: string): Promise<string> {
		await this._shiftsRepository.delete(id);
		return "DELETED";
	}
}

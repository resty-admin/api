import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";

import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { ErrorsEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import type { CreateShiftDto, UpdateShiftDto } from "../dtos";
import type { CreateShiftInput, UpdateShiftInput } from "../dtos";
import { ActiveShiftEntity } from "../entities";
import { HistoryShiftEntity } from "../entities/history-shift.entity";

@Injectable()
export class ShiftsService {
	private findRelations = ["tables", "tables.hall", "waiter", "place"];
	private findOneRelations = ["tables", "tables.hall", "waiter", "place"];

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

	async getActiveShift(id: string) {
		return this._shiftsRepository.findOne({
			where: {
				user: {
					id
				}
			},
			relations: this.findOneRelations
		});
	}

	async createShift(shift: CreateShiftDto | CreateShiftInput, user: IUser) {
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

	async updateShift(id: string, shift: UpdateShiftDto | UpdateShiftInput): Promise<ActiveShiftEntity> {
		return this._shiftsRepository.save({ id, ...shift });
	}

	async deleteShift(id: string): Promise<string> {
		await this._shiftsRepository.delete(id);
		return "DELETED";
	}
}

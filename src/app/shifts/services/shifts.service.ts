import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateShiftDto, UpdateShiftDto } from "../dtos";
import { ActiveShiftEntity } from "../entities";

@Injectable()
export class ShiftsService {
	private findRelations = [];
	private findOneRelations = [];

	constructor(@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository) {}

	async getShift(id: string) {
		return this._shiftsRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getShifts({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

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

	async createShift(shift: CreateShiftDto): Promise<ActiveShiftEntity> {
		const savedCategory = await this._shiftsRepository.save({ ...shift });

		return this._shiftsRepository.findOne({
			where: { id: savedCategory.id }
		});
	}

	async updateShift(id: string, shift: UpdateShiftDto): Promise<ActiveShiftEntity> {
		return this._shiftsRepository.save({ id, ...shift });
	}

	async deleteShift(id: string): Promise<string> {
		await this._shiftsRepository.delete(id);
		return "DELETED";
	}
}

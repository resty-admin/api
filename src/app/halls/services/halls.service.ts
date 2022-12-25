import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateHallDto, UpdateHallDto } from "../dtos";
import type { CreateHallInput, UpdateHallInput } from "../dtos";
import { HallEntity } from "../entities";

@Injectable()
export class HallsService {
	private findRelations = ["place", "tables", "file"];
	private findOneRelations = ["place", "tables", "file"];

	constructor(@InjectRepository(HallEntity) private readonly _hallsRepository: Repository<HallEntity>) {}

	async getHall(id: string) {
		return this._hallsRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getHalls({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

		const [data, count] = await this._hallsRepository.findAndCount({
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

	async createHall(hall: CreateHallDto | CreateHallInput): Promise<HallEntity> {
		const savedHall = await this._hallsRepository.save({ ...hall, place: { id: hall.place } });

		return this._hallsRepository.findOne({
			where: { id: savedHall.id }
		});
	}

	async updateHall(id: string, hall: UpdateHallDto | UpdateHallInput): Promise<HallEntity> {
		return this._hallsRepository.save({ id, ...hall });
	}

	async deleteHall(id: string): Promise<string> {
		await this._hallsRepository.delete(id);
		return `${id} deleted`;
	}
}

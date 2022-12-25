import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CompanyEntity } from "../../companies/entities";
import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreatePlaceDto, UpdatePlaceDto } from "../dtos";
import { PlaceEntity } from "../entities";

@Injectable()
export class PlacesService {
	private findRelations = ["company", "company.owner", "halls", "file"];
	private findOneRelations = ["company", "company.owner", "halls", "file"];

	constructor(
		@InjectRepository(PlaceEntity) private readonly _placesRepository: Repository<PlaceEntity>,
		@InjectRepository(CompanyEntity) private readonly _companiesRepository: Repository<CompanyEntity>
	) {}

	async getPlace(id: string) {
		return this._placesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getPlaces({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

		const [data, count] = await this._placesRepository.findAndCount({
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

	async createPlace(place: CreatePlaceDto): Promise<PlaceEntity> {
		const savedPlace = await this._placesRepository.save({ ...place, company: { id: place.company } });

		return this._placesRepository.findOne({ where: { id: savedPlace.id } });
	}

	async updatePlace(id: string, place: UpdatePlaceDto): Promise<PlaceEntity> {
		return this._placesRepository.save({ id, ...place });
	}

	async deletePlace(id: string): Promise<string> {
		await this._placesRepository.delete(id);
		return `${id} deleted`;
	}
}

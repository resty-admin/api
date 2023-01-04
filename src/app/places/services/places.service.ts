import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CompanyEntity } from "../../companies/entities";
import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreatePlaceDto, UpdatePlaceDto } from "../dtos";
import type { CreatePlaceInput, UpdatePlaceInput } from "../dtos";
import { PlaceEntity } from "../entities";

@Injectable()
export class PlacesService {
	private findRelations = ["company", "company.owner", "halls", "file"];
	private findOneRelations = ["company", "company.owner", "halls", "file"];

	constructor(
		@InjectRepository(PlaceEntity) private readonly _placesRepository,
		@InjectRepository(CompanyEntity) private readonly _companiesRepository
	) {}

	async getPlace(id: string) {
		return this._placesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getPlaces({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

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

	async createPlace(place: CreatePlaceDto | CreatePlaceInput): Promise<PlaceEntity> {
		const savedPlace = await this._placesRepository.save({ ...place, company: { id: place.company } });

		return this._placesRepository.findOne({ where: { id: savedPlace.id } });
	}

	async updatePlace(id: string, place: UpdatePlaceDto | UpdatePlaceInput): Promise<PlaceEntity> {
		await this._placesRepository.save({ id, ...place });

		return this._placesRepository.findOne({ where: { id }, relations: this.findOneRelations });
	}

	async deletePlace(id: string): Promise<string> {
		await this._placesRepository.delete(id);
		return `${id} deleted`;
	}
}

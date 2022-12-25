import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateAttributeDto, UpdateAttributeDto } from "../dtos";
import type { CreateAttributeInput, UpdateAttributeInput } from "../dtos";
import { AttributesEntity } from "../entities";

@Injectable()
export class AttributesService {
	constructor(
		@InjectRepository(AttributesEntity) private readonly _attributesRepository: Repository<AttributesEntity>
	) {}

	async getAttribute(id: string) {
		return this._attributesRepository.findOne({
			where: { id }
		});
	}

	async getAttributes({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

		const [data, count] = await this._attributesRepository.findAndCount({
			where: findOptions.where,
			take,
			skip
		});

		return {
			data,
			totalCount: count,
			page: skip / take + 1
		};
	}

	async createAttribute(attributeDto: CreateAttributeDto | CreateAttributeInput): Promise<AttributesEntity> {
		const savedAttribute = await this._attributesRepository.save(attributeDto);

		return this._attributesRepository.findOne({
			where: { id: savedAttribute.id }
		});
	}

	async updateAttribute(
		id: string,
		attributeDto: UpdateAttributeDto | UpdateAttributeInput
	): Promise<AttributesEntity> {
		return this._attributesRepository.save({ id, ...attributeDto });
	}

	async deleteAttribute(id: string): Promise<string> {
		await this._attributesRepository.delete(id);
		return "DELETED";
	}
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateAttributeGroupDto, UpdateAttributeGroupDto } from "../dtos";
import type { CreateAttributeGroupInput, UpdateAttributeGroupInput } from "../dtos";
import { AttributesGroupEntity } from "../entities";

@Injectable()
export class AttributeGroupsService {
	private findRelations = ["attributes"];
	private findOneRelations = ["attributes"];

	constructor(
		@InjectRepository(AttributesGroupEntity)
		private readonly _attributeGroupsRepository: Repository<AttributesGroupEntity>
	) {}

	async getAttributeGroup(id: string) {
		return this._attributeGroupsRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getAttributeGroups({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._attributeGroupsRepository.findAndCount({
			where: findOptions.where,
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

	async createAttributeGroup(
		attributeGroupDto: CreateAttributeGroupDto | CreateAttributeGroupInput
	): Promise<AttributesGroupEntity> {
		const savedAttributeGroup = await this._attributeGroupsRepository.save({
			...attributeGroupDto,
			place: { id: attributeGroupDto.place },
			attributes: attributeGroupDto.attributes?.length ? attributeGroupDto.attributes.map((el) => ({ id: el })) : null
		});

		return this._attributeGroupsRepository.findOne({
			where: { id: savedAttributeGroup.id }
		});
	}

	async updateAttributeGroup(
		id: string,
		attributeGroupDto: UpdateAttributeGroupDto | UpdateAttributeGroupInput
	): Promise<AttributesGroupEntity> {
		return this._attributeGroupsRepository.save({
			...attributeGroupDto,
			id,
			attributes: attributeGroupDto.attributes?.length ? attributeGroupDto.attributes.map((el) => ({ id: el })) : null
		});
	}

	async deleteAttributeGroup(id: string): Promise<string> {
		await this._attributeGroupsRepository.delete(id);
		return "DELETED";
	}
}

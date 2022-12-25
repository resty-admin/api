import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateLanguageDto, UpdateLanguageDto } from "../dtos";
import { LanguageEntity } from "../entities";

@Injectable()
export class LanguagesService {
	private findRelations = ["file"];
	private findOneRelations = ["file"];

	constructor(@InjectRepository(LanguageEntity) private readonly _languagesRepository: Repository<LanguageEntity>) {}

	async getLanguage(id: string) {
		return this._languagesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getLanguages({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

		const [data, count] = await this._languagesRepository.findAndCount({
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

	async createLanguage(language: CreateLanguageDto): Promise<LanguageEntity> {
		const savedLanguage = await this._languagesRepository.save({ ...language });

		return this._languagesRepository.findOne({
			where: { id: savedLanguage.id }
		});
	}

	async updateLanguage(id: string, language: UpdateLanguageDto): Promise<LanguageEntity> {
		return this._languagesRepository.save({ id, ...language });
	}

	async deleteLanguage(id: string): Promise<string> {
		await this._languagesRepository.delete(id);
		return `${id} deleted`;
	}
}

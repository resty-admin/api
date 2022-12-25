import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateCategoryDto, UpdateCategoryDto } from "../dtos";
import { CategoryEntity } from "../entities";

@Injectable()
export class CategoriesService {
	private findRelations = ["file"];
	private findOneRelations = ["file"];

	constructor(@InjectRepository(CategoryEntity) private readonly _categoriesRepository) {}

	async getCategory(id: string) {
		return this._categoriesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getCategories({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

		const [data, count] = await this._categoriesRepository.findAndCount({
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

	async createCategory(category: CreateCategoryDto): Promise<CategoryEntity> {
		const savedCategory = await this._categoriesRepository.save({ ...category, place: { id: category.place } });

		return this._categoriesRepository.findOne({
			where: { id: savedCategory.id }
		});
	}

	async updateCategory(id: string, category: UpdateCategoryDto): Promise<CategoryEntity> {
		return this._categoriesRepository.save({ id, ...category });
	}

	async deleteCategory(id: string): Promise<string> {
		await this._categoriesRepository.delete(id);
		return "DELETED";
	}
}

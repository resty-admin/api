import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ActiveOrderEntity } from "../../orders/entities";
import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import { OrderStatusEnum } from "../../shared/enums";
import type { CreateCategoryDto, UpdateCategoryDto } from "../dtos";
import type { CreateCategoryInput, UpdateCategoryInput } from "../dtos";
import { CategoryEntity } from "../entities";

@Injectable()
export class CategoriesService {
	private findRelations = ["file", "products"];
	private findOneRelations = ["file", "products"];

	constructor(
		@InjectRepository(CategoryEntity) private readonly _categoriesRepository,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository
	) {}

	async getCategory(id: string) {
		return this._categoriesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getCategories({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

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

	async createCategory(category: CreateCategoryDto | CreateCategoryInput): Promise<CategoryEntity> {
		const savedCategory = await this._categoriesRepository.save({ ...category, place: { id: category.place } });

		return this._categoriesRepository.findOne({
			where: { id: savedCategory.id }
		});
	}

	async updateCategory(id: string, category: UpdateCategoryDto | UpdateCategoryInput): Promise<CategoryEntity> {
		await this._categoriesRepository.save({ id, ...category });

		return this._categoriesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async deleteCategory(id: string): Promise<string> {
		const orders: ActiveOrderEntity[] = await this._ordersRepository.find({
			where: {
				usersToOrders: {
					product: {
						category: { id }
					}
				}
			},
			relations: ["usersToOrders", "usersToOrders.product", "usersToOrders.product.category"]
		});

		const isActiveOrdersPresent = orders.some((el) => el.status !== OrderStatusEnum.CLOSED);

		if (isActiveOrdersPresent) {
			await this._categoriesRepository.save({ id, isHide: true });

			return `Category is using in active order(s). Category will be hide for now`;
		}

		await this._categoriesRepository.delete(id);
		return "DELETED";
	}
}

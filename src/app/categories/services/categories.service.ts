import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ActiveOrderEntity } from "../../orders/entities";
import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { OrderStatusEnum } from "../../shared/enums";
import type { CreateCategoryInput, UpdateCategoryInput } from "../dtos";
import { CategoryEntity } from "../entities";

@Injectable()
export class CategoriesService {
	private findRelations = ["file", "products", "products.attrsGroups"];
	private findOneRelations = ["file", "products", "products.attrsGroups"];

	constructor(
		@InjectRepository(CategoryEntity) private readonly _categoriesRepository: Repository<CategoryEntity>,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>
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
			order: {
				orderNumber: "ASC"
			},
			take,
			skip
		});

		return {
			data,
			totalCount: count,
			page: skip / take + 1
		};
	}

	async createCategory(category: CreateCategoryInput): Promise<CategoryEntity> {
		const categories = await this._categoriesRepository.find({
			where: {
				place: {
					id: category.place
				}
			}
		});
		const orderNumber = ++categories.sort((a, b) => a.orderNumber - b.orderNumber)[categories.length - 1].orderNumber;

		const savedCategory = await this._categoriesRepository.save({
			...category,
			orderNumber,
			place: { id: category.place }
		});

		return this._categoriesRepository.findOne({
			where: { id: savedCategory.id }
		});
	}

	async updateCategory(id: string, category: UpdateCategoryInput): Promise<CategoryEntity> {
		await this._categoriesRepository.save({ id, ...category });

		return this._categoriesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async deleteCategory(id: string): Promise<string> {
		const orders: ActiveOrderEntity[] = await this._ordersRepository.find({
			where: {
				productsToOrders: {
					product: {
						category: { id }
					}
				}
			},
			relations: ["productsToOrders", "productsToOrders.product", "productsToOrders.product.category"]
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

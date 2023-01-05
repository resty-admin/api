import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ActiveOrderEntity } from "../../orders/entities";
import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import { OrderStatusEnum } from "../../shared/enums";
import type { CreateProductDto, UpdateProductDto } from "../dtos";
import type { CreateProductInput, UpdateProductInput } from "../dtos";
import { ProductEntity } from "../entities";

@Injectable()
export class ProductsService {
	private findRelations = ["file", "category", "attrsGroups", "attrsGroups.attributes"];
	private findOneRelations = ["file", "category", "attrsGroups", "attrsGroups.attributes"];

	constructor(
		@InjectRepository(ProductEntity) private readonly _productsRepository,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository
	) {}

	async getProduct(id: string) {
		return this._productsRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getProducts({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._productsRepository.findAndCount({
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

	async createProduct(product: CreateProductDto | CreateProductInput): Promise<ProductEntity> {
		const savedProduct = await this._productsRepository.save({
			...product,
			category: { id: product.category },
			attrsGroups: product.attrsGroups?.map((id) => ({ id }))
		});

		return this._productsRepository.findOne({
			where: { id: savedProduct.id }
		});
	}

	async updateProduct(id: string, user: UpdateProductDto | UpdateProductInput): Promise<ProductEntity> {
		await this._productsRepository.save({ id, ...user });

		return this._productsRepository.findOne({ where: { id }, relations: this.findOneRelations });
	}

	async deleteProduct(id: string): Promise<string> {
		const orders: ActiveOrderEntity[] = await this._ordersRepository.find({
			where: {
				usersToOrders: {
					product: { id }
				}
			},
			relations: ["usersToOrders", "usersToOrders.product"]
		});

		const isActiveOrdersPresent = orders.some((el) => el.status !== OrderStatusEnum.CLOSED);

		if (isActiveOrdersPresent) {
			await this._productsRepository.save({ id, isHide: true });

			return `Product is using in active order(s). Product will be hide for now`;
		}

		await this._productsRepository.delete(id);
		return "DELETED";
	}
}

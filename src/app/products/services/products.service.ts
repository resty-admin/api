import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { DeepPartial } from "typeorm";
import { Repository } from "typeorm";

import { ActiveOrderEntity } from "../../orders/entities";
import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { OrderStatusEnum } from "../../shared/enums";
import type { CreateProductInput, UpdateProductInput } from "../dtos";
import { ProductEntity } from "../entities";

@Injectable()
export class ProductsService {
	private findRelations = ["file", "category", "attrsGroups", "attrsGroups.attributes"];
	private findOneRelations = ["file", "category", "attrsGroups", "attrsGroups.attributes"];

	constructor(
		@InjectRepository(ProductEntity) private readonly _productsRepository: Repository<ProductEntity>,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>
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

	async createProduct(product: CreateProductInput): Promise<ProductEntity> {
		const products = await this._productsRepository.find({
			where: {
				category: {
					id: product.category
				}
			}
		});
		const orderNumber =
			products.length > 0
				? ++products.sort((a, b) => a.orderNumber - b.orderNumber)[products.length - 1].orderNumber
				: 0;

		const savedProduct = await this._productsRepository.save({
			...product,
			orderNumber,
			category: { id: product.category },
			attrsGroups: product.attrsGroups?.map((id) => ({ id }))
		});

		return this._productsRepository.findOne({
			where: { id: savedProduct.id }
		});
	}

	async updateProduct(id: string, user: UpdateProductInput): Promise<ProductEntity> {
		await this._productsRepository.save({ id, ...user } as DeepPartial<ProductEntity>);

		return this._productsRepository.findOne({ where: { id }, relations: this.findOneRelations });
	}

	async deleteProduct(id: string): Promise<string> {
		const orders: ActiveOrderEntity[] = await this._ordersRepository.find({
			where: {
				productsToOrders: {
					product: { id }
				}
			},
			relations: ["productsToOrders", "productsToOrders.product"]
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

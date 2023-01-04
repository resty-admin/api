import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateProductDto, UpdateProductDto } from "../dtos";
import type { CreateProductInput, UpdateProductInput } from "../dtos";
import { ProductEntity } from "../entities";

@Injectable()
export class ProductsService {
	private findRelations = ["file", "category", "attrsGroups", "attrsGroups.attributes"];
	private findOneRelations = ["file", "category", "attrsGroups", "attrsGroups.attributes"];

	constructor(@InjectRepository(ProductEntity) private readonly _productsRepository) {}

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
		await this._productsRepository.delete(id);
		return "DELETED";
	}
}

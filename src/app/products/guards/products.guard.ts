import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CategoryEntity } from "../../categories/entities";
import { UserRoleEnum } from "../../shared/enums";
import { ProductEntity } from "../entities";

export class ProductsGuard implements CanActivate {
	constructor(
		@InjectRepository(ProductEntity) private readonly _productRepository: Repository<ProductEntity>,
		@InjectRepository(CategoryEntity) private readonly _categoryRepository: Repository<CategoryEntity>
	) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		const { productId = null } = request.body.variables;
		const { category = null, id = null } = request.body.variables.product || {};

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		if (id || productId) {
			return this.updateGuard(id || productId, request.user.id);
		}

		return this.createGuard(category, request.user.id);
	}

	async createGuard(category: string, userId) {
		const currCategory = await this._categoryRepository.findOne({
			where: {
				id: category
			},
			relations: ["place", "place.company", "place.company.owner"]
		});

		if (!currCategory) {
			return false;
		}

		return currCategory.place.company.owner.id === userId;
	}

	async updateGuard(productId: string, userId) {
		const currProduct = await this._productRepository.findOne({
			where: {
				id: productId
			},
			relations: ["category", "category.place", "category.place.company", "category.place.company.owner"]
		});

		return currProduct.category.place.company.owner.id === userId;
	}
}

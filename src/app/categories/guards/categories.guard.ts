import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { UserRoleEnum } from "../../shared/enums";
import { CategoryEntity } from "../entities";

export class CategoriesGuard implements CanActivate {
	constructor(
		@InjectRepository(CategoryEntity) private readonly _categoryRepository: Repository<CategoryEntity>,
		@InjectRepository(PlaceEntity) private readonly _placeRepository: Repository<PlaceEntity>
	) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		const { categoryId = null } = request.body.variables;
		const { place = null, id = null } = request.body.variables.category || {};

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		if (id || categoryId) {
			return this.updateGuard(id || categoryId, request.user.id);
		}

		return this.createGuard(place, request.user.id);
	}

	async createGuard(place: string, userId) {
		const currPlace = await this._placeRepository.findOne({
			where: {
				id: place
			},
			relations: ["company", "company.owner"]
		});

		if (!currPlace) {
			return false;
		}

		return currPlace.company.owner.id === userId;
	}

	async updateGuard(catId: string, userId) {
		const currCategory = await this._categoryRepository.findOne({
			where: {
				id: catId
			},
			relations: ["place", "place.company", "place.company.owner"]
		});

		return currCategory.place.company.owner.id === userId;
	}
}

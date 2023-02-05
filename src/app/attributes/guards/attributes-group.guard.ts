import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { UserRoleEnum } from "../../shared/enums";

export class AttributesGroupGuard implements CanActivate {
	constructor(@InjectRepository(PlaceEntity) private readonly _placeRepository: Repository<PlaceEntity>) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		const { attrGroupId = null } = request.body.variables;
		const { place = null, id = null } = request.body.variables.attrGroup || {};

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		if (id || attrGroupId) {
			return this.updateGuard(id || attrGroupId, request.user.id);
		}

		return this.createGuard(place, request.user.id);
	}

	async createGuard(placeId: string, userId: string) {
		const currPlace = await this._placeRepository.findOne({
			where: {
				id: placeId
			},
			relations: ["company", "company.owner"]
		});

		if (!currPlace) {
			return false;
		}

		return currPlace.company.owner.id === userId;
	}

	async updateGuard(attrGroupId: string, userId: string) {
		console.log("here");
		const currPlace = await this._placeRepository.findOne({
			where: {
				attrGroups: {
					id: attrGroupId
				}
			},
			relations: ["attrGroups", "company", "company.owner"]
		});

		return currPlace.company.owner.id === userId;
	}
}

import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { UserRoleEnum } from "../../shared/enums";
import { HallEntity } from "../entities";

export class HallsGuard implements CanActivate {
	constructor(
		@InjectRepository(HallEntity) private readonly _hallRepository: Repository<HallEntity>,
		@InjectRepository(PlaceEntity) private readonly _placeRepository: Repository<PlaceEntity>
	) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		const { hallId = null } = request.body.variables;
		const { place = null, id = null } = request.body.variables.hall || {};

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		if (id || hallId) {
			return this.updateGuard(id || hallId, request.user.id);
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

	async updateGuard(hallId: string, userId) {
		const currHall = await this._hallRepository.findOne({
			where: {
				id: hallId
			},
			relations: ["place", "place.company", "place.company.owner"]
		});

		return currHall.place.company.owner.id === userId;
	}
}

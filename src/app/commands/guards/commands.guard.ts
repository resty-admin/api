import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { UserRoleEnum } from "../../shared/enums";
import { CommandEntity } from "../entities";

export class CommandsGuard implements CanActivate {
	constructor(
		@InjectRepository(CommandEntity) private readonly _commandRepository: Repository<CommandEntity>,
		@InjectRepository(PlaceEntity) private readonly _placeRepository: Repository<PlaceEntity>
	) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		console.log("here");
		const { commandId = null } = request.body.variables;
		const { place = null, id = null } = request.body.variables.command || {};

		if (request.user.role === UserRoleEnum.ADMIN) {
			console.log("1");
			return true;
		}

		if (id || commandId) {
			return this.updateGuard(id || commandId, request.user.id);
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
		const currCommand = await this._commandRepository.findOne({
			where: {
				id: catId
			},
			relations: ["place", "place.company", "place.company.owner"]
		});

		return currCommand.place.company.owner.id === userId;
	}
}

import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { UserRoleEnum } from "../../shared/enums";
import { AttributesEntity, AttributesGroupEntity } from "../entities";

export class AttributesGuard implements CanActivate {
	constructor(
		@InjectRepository(AttributesGroupEntity) private readonly _attrsRepository: Repository<AttributesGroupEntity>,
		@InjectRepository(AttributesEntity) private readonly _attrRepository: Repository<AttributesEntity>
	) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		const { attrId = null } = request.body.variables;
		const { attributesGroup = null, id = null } = request.body.variables.attr || {};

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		if (id || attrId) {
			return this.updateGuard(id || attrId, request.user.id);
		}

		return this.createGuard(attributesGroup, request.user.id);
	}

	async createGuard(attrGroups: string[], userId) {
		const currAttrGroups = await this._attrsRepository.find({
			where: {
				id: In(attrGroups)
			},
			relations: ["place", "place.company", "place.company.owner"]
		});

		if (currAttrGroups.length === 0) {
			return false;
		}

		return currAttrGroups.every((el) => el.place.company.owner.id === userId);
	}

	async updateGuard(attrId: string, userId) {
		const attrGroups = await this._attrsRepository.find({
			where: {
				attributes: {
					id: attrId
				}
			},
			relations: ["place", "place.company", "place.company.owner"]
		});

		return attrGroups.every((el) => el.place.company.owner.id === userId);
	}
}

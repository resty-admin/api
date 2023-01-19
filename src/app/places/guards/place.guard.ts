import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CompanyEntity } from "../../companies/entities";
import { UserRoleEnum } from "../../shared/enums";

export class PlaceGuard implements CanActivate {
	constructor(@InjectRepository(CompanyEntity) private readonly _companyRepository: Repository<CompanyEntity>) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;
		const { placeId = null } = request.body.variables;
		const { company = null, id = null } = request.body.variables.place || {};

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		if (id || placeId) {
			return this.updateGuard(id || placeId, request.user.id);
		}

		return this.createGuard(company, request.user.id);
	}

	async createGuard(companyId: string, userId) {
		console.log("222", companyId, userId);
		const currCompany = await this._companyRepository.findOne({
			where: {
				id: companyId
			},
			relations: ["owner"]
		});

		if (!currCompany) {
			return false;
		}

		return currCompany.owner.id === userId;
	}

	async updateGuard(placeId: string, userId) {
		const currCompany = await this._companyRepository.findOne({
			where: {
				places: {
					id: placeId
				}
			},
			relations: ["owner"]
		});

		return currCompany.owner.id === userId;
	}
}

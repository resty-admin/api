import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserRoleEnum } from "../../shared/enums";
import { CompanyEntity } from "../entities";

export class CompaniesGuard implements CanActivate {
	constructor(@InjectRepository(CompanyEntity) private readonly _companyRepository: Repository<CompanyEntity>) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		const { companyId = null } = request.body.variables;
		const { id = null } = request.body.variables.company || {};

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		if (id || companyId) {
			return this.updateGuard(id || companyId, request.user.id);
		}

		return true;
	}

	async updateGuard(companyId: string, userId) {
		const currCommand = await this._companyRepository.findOne({
			where: {
				id: companyId
			},
			relations: ["owner"]
		});

		return currCommand.owner.id === userId;
	}
}

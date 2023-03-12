import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CompanyEntity } from "../../companies/entities";
import { UserRoleEnum } from "../../shared/enums";
import { UserEntity } from "../../users/entities";
import { UserToPlaceEntity } from "../entities";

export class PlaceEmployeeGuard implements CanActivate {
	constructor(
		@InjectRepository(CompanyEntity) private readonly _companyRepository: Repository<CompanyEntity>,
		@InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>,
		@InjectRepository(UserToPlaceEntity) private readonly _uTpRepository: Repository<UserToPlaceEntity>
	) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;
		const { userToPlaceId } = request.body.variables;

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		return this.employeeGuard(userToPlaceId, request.user.id);
	}

	async employeeGuard(userToPlaceId: string, userId: string) {
		const uTp = await this._uTpRepository.findOne({
			where: {
				id: userToPlaceId
			},
			relations: ["user", "place", "place.company", "place.company.owner"]
		});

		const notValid = !uTp || uTp.place.company.owner.id !== userId;

		if (notValid) {
			return false;
		}

		return uTp.role !== UserRoleEnum.MANAGER;
	}
}

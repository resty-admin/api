import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CompanyEntity } from "../../companies/entities";
import { UserRoleEnum } from "../../shared/enums";
import { UserEntity } from "../../users/entities";

export class PlaceEmployeeGuard implements CanActivate {
	constructor(
		@InjectRepository(CompanyEntity) private readonly _companyRepository: Repository<CompanyEntity>,
		@InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>
	) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;
		const { placeId, userId } = request.body.variables.employeeData;

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		return this.employeeGuard(placeId, userId, request.user.id);
	}

	async employeeGuard(placeId: string, employeeId: string, userId: string) {
		const currCompany = await this._companyRepository.findOne({
			where: {
				owner: {
					id: userId
				}
			},
			relations: ["owner", "places", "places.employees"]
		});

		if (!currCompany) {
			return false;
		}

		const placeExist = currCompany.places.find((el) => el.id === placeId);

		if (!placeExist) {
			return false;
		}

		const user = await this._userRepository.findOne({
			where: {
				id: employeeId
			},
			relations: ["place"]
		});

		return (
			user &&
			(user.role === UserRoleEnum.WAITER || user.role === UserRoleEnum.HOSTESS || user.role === UserRoleEnum.HOOKAH)
		);
	}
}

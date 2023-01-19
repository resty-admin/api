import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { HallEntity } from "../../halls/entities";
import { UserRoleEnum } from "../../shared/enums";
import { TableEntity } from "../entities";

export class TablesGuard implements CanActivate {
	constructor(
		@InjectRepository(TableEntity) private readonly _tableRepository: Repository<TableEntity>,
		@InjectRepository(HallEntity) private readonly _hallRepository: Repository<HallEntity>
	) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		const { tableId = null } = request.body.variables;
		const { hall = null, id = null } = request.body.variables.table || {};

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		if (id || tableId) {
			return this.updateGuard(id || tableId, request.user.id);
		}

		return this.createGuard(hall, request.user.id);
	}

	async createGuard(hall: string, userId) {
		const currHall = await this._hallRepository.findOne({
			where: {
				id: hall
			},
			relations: ["place", "place.company", "place.company.owner"]
		});

		if (!currHall) {
			return false;
		}

		return currHall.place.company.owner.id === userId;
	}

	async updateGuard(table: string, userId) {
		const currTable = await this._tableRepository.findOne({
			where: {
				id: table
			},
			relations: ["hall", "hall.place", "hall.place.company.owner"]
		});

		return currTable.hall.place.company.owner.id === userId;
	}
}

import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { UserRoleEnum } from "../../shared/enums";
import { TableEntity } from "../../tables/entities";
import { ActiveShiftEntity } from "../entities";

export class ShiftsGuard implements CanActivate {
	constructor(
		@InjectRepository(ActiveShiftEntity) private readonly _shiftRepository: Repository<ActiveShiftEntity>,
		@InjectRepository(TableEntity) private readonly _tableRepository: Repository<TableEntity>
	) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;

		const { shiftId = null } = request.body.variables;
		const { tables = [], id = null } = request.body.variables.shift || {};

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		if (id || shiftId) {
			return this.updateGuard(id || shiftId, request.user.id);
		}

		return this.createGuard(tables, request.user.id);
	}

	async createGuard(tables: string[], userId) {
		const currTable = await this._tableRepository.findOne({
			where: {
				id: In(tables)
			},
			relations: ["hall", "hall.place", "hall.place.company", "hall.place.company.owner"]
		});

		return currTable.hall.place.company.owner.id === userId;
	}

	async updateGuard(shift: string, userId) {
		const currShift = await this._shiftRepository.findOne({
			where: {
				id: shift
			},
			relations: ["tables", "tables.place", "tables.place.owner"]
		});

		return currShift.tables[0].hall.place.company.owner.id === userId;
	}
}

import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard, UserGql } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { UserRoleEnum } from "../../shared/enums";
import { IUser } from "../../shared/interfaces";
import { CreateTableInput, UpdateTableInput } from "../dtos";
import { PaginatedTable, TableEntity } from "../entities";
import { TablesGuard } from "../guards/tables.guard";
import { TablesService } from "../services";

@Resolver(() => TableEntity)
export class TablesResolver {
	constructor(private readonly _tablesService: TablesService) {}

	@Query(() => TableEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async table(@Args("id", { type: () => String }) id: string) {
		return this._tablesService.getTable(id);
	}

	@Query(() => PaginatedTable)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async tables(@Args() args: PaginationArgsDto) {
		return this._tablesService.getTables(args);
	}

	@Mutation(() => TableEntity)
	@UseGuards(GqlJwtGuard, TablesGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async createTable(@Args("table") table: CreateTableInput) {
		return this._tablesService.createTable(table);
	}

	@Mutation(() => TableEntity)
	@UseGuards(GqlJwtGuard, TablesGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async updateTable(@Args("table") table: UpdateTableInput) {
		return this._tablesService.updateTable(table.id, table);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, TablesGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async deleteTable(@Args("tableId") id: string) {
		return this._tablesService.deleteTable(id);
	}

	@Mutation(() => TableEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async getTableByCode(@Args("code") code: number, @Args("placeId") placeId: string) {
		return this._tablesService.getTableByCode(code, placeId);
	}

	@Query(() => TableEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async isTableAvailableForReserve(@Args("tableId") tableId: string, @Args("date") date: Date, @UserGql() user: IUser) {
		return this._tablesService.isTableAvailableForReserve(tableId, date, user);
	}
}

import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { PaginatedTable, TableEntity } from "../entities";
import { TablesService } from "../services";

@Resolver(() => TableEntity)
export class TablesResolver {
	constructor(private readonly _tablesService: TablesService) {}

	@Query(() => TableEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async table(@Args("id", { type: () => String }) id: string) {
		return this._tablesService.getTable(id);
	}

	@Query(() => PaginatedTable)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async tables(@Args() args: PaginationArgsDto) {
		return this._tablesService.getTables(args);
	}
}

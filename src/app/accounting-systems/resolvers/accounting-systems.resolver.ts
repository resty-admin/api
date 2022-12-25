import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { AccountingSystemEntity, PaginatedAccountingSystem } from "../entities";
import { AccountingSystemsService } from "../services";

@Resolver(() => AccountingSystemEntity)
export class AccountingSystemsResolver {
	constructor(private readonly _accountingSystemService: AccountingSystemsService) {}

	@Query(() => AccountingSystemEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async accountingSystem(@Args("id", { type: () => String }) id: string) {
		return this._accountingSystemService.getAccountingSystem(id);
	}

	@Query(() => PaginatedAccountingSystem)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async accountingSystems(@Args() args: PaginationArgsDto) {
		return this._accountingSystemService.getAccountingSystems(args);
	}
}

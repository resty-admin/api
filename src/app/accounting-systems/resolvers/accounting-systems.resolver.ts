import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { UserRoleEnum } from "../../shared/enums";
import { CreateAccountingSystemInput, UpdateAccountingSystemInput } from "../dtos";
import { AccountingSystemEntity, PaginatedAccountingSystem } from "../entities";
import { AccountingSystemsService } from "../services";

@Resolver(() => AccountingSystemEntity)
export class AccountingSystemsResolver {
	constructor(private readonly _accountingSystemService: AccountingSystemsService) {}

	@Query(() => AccountingSystemEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async accountingSystem(@Args("id", { type: () => String }) id: string) {
		return this._accountingSystemService.getAccountingSystem(id);
	}

	@Query(() => PaginatedAccountingSystem)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async accountingSystems(@Args() args: PaginationArgsDto) {
		return this._accountingSystemService.getAccountingSystems(args);
	}

	@Mutation(() => AccountingSystemEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createAccountingSystem(@Args("accountingSystem") accountingSystem: CreateAccountingSystemInput) {
		return this._accountingSystemService.creatAccountingSystem(accountingSystem);
	}

	@Mutation(() => AccountingSystemEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateAccountingSystem(@Args("accountingSystem") accountingSystem: UpdateAccountingSystemInput) {
		return this._accountingSystemService.updateAccountingSystem(accountingSystem.id, accountingSystem);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteAccountingSystem(@Args("accountingSystemId") id: string) {
		return this._accountingSystemService.deleteAccountingSystem(id);
	}
}

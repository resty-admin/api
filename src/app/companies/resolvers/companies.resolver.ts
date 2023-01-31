import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard, UserGql } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { UserRoleEnum } from "../../shared/enums";
import { IUser } from "../../shared/interfaces";
import { CreateCompanyInput, UpdateCompanyInput } from "../dtos";
import { CompanyEntity, PaginatedCompany } from "../entities";
import { CompaniesGuard } from "../guards/companies.guard";
import { CompaniesService } from "../services";

@Resolver(() => CompanyEntity)
export class CompaniesResolver {
	constructor(private readonly _companiesService: CompaniesService) {}

	@Query(() => CompanyEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async company(@Args("id", { type: () => String }) id: string) {
		return this._companiesService.getCompany(id);
	}

	@Query(() => PaginatedCompany)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async companies(@Args() args: PaginationArgsDto, @UserGql() user: IUser) {
		return this._companiesService.getCompanies(args, user);
	}

	@Mutation(() => CompanyEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async createCompany(@Args("company") company: CreateCompanyInput, @UserGql() user: IUser) {
		return this._companiesService.createCompany(company, user);
	}

	@Mutation(() => CompanyEntity)
	@UseGuards(GqlJwtGuard, CompaniesGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async updateCompany(@Args("company") company: UpdateCompanyInput) {
		return this._companiesService.updateCompany(company.id, company);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, CompaniesGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async deleteCompany(@Args("companyId") id: string) {
		return this._companiesService.deleteCompany(id);
	}
}

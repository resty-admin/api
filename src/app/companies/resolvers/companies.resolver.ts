import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CompanyEntity, PaginatedCompany } from "../entities";
import { CompaniesService } from "../services";

@Resolver(() => CompanyEntity)
export class CompaniesResolver {
	constructor(private readonly _companiesService: CompaniesService) {}

	@Query(() => CompanyEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async company(@Args("id", { type: () => String }) id: string) {
		return this._companiesService.getCompany(id);
	}

	@Query(() => PaginatedCompany)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async companies(@Args() args: PaginationArgsDto) {
		return this._companiesService.getCompanies(args);
	}
}

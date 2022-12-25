import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CategoryEntity, PaginatedCategory } from "../entities";
import { CategoriesService } from "../services";

@Resolver(() => CategoryEntity)
export class CategoriesResolver {
	constructor(private readonly _categoriesService: CategoriesService) {}

	@Query(() => CategoryEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async category(@Args("id", { type: () => String }) id: string) {
		return this._categoriesService.getCategory(id);
	}

	@Query(() => PaginatedCategory)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async categories(@Args() args: PaginationArgsDto) {
		return this._categoriesService.getCategories(args);
	}
}

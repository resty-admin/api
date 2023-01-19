import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { UserRoleEnum } from "../../shared/enums";
import { CreateCategoryInput, UpdateCategoryInput } from "../dtos";
import { CategoryEntity, PaginatedCategory } from "../entities";
import { CategoriesGuard } from "../guards/categories.guard";
import { CategoriesService } from "../services";

@Resolver(() => CategoryEntity)
export class CategoriesResolver {
	constructor(private readonly _categoriesService: CategoriesService) {}

	@Query(() => CategoryEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.CLIENT,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async category(@Args("id", { type: () => String }) id: string) {
		return this._categoriesService.getCategory(id);
	}

	@Query(() => PaginatedCategory)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.CLIENT,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async categories(@Args() args: PaginationArgsDto) {
		return this._categoriesService.getCategories(args);
	}

	@Mutation(() => CategoryEntity)
	@UseGuards(GqlJwtGuard, CategoriesGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async createCategory(@Args("category") category: CreateCategoryInput) {
		return this._categoriesService.createCategory(category);
	}

	@Mutation(() => CategoryEntity)
	@UseGuards(GqlJwtGuard, CategoriesGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async updateCategory(@Args("category") category: UpdateCategoryInput) {
		return this._categoriesService.updateCategory(category.id, category);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, CategoriesGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async deleteCategory(@Args("categoryId") id: string) {
		return this._categoriesService.deleteCategory(id);
	}
}

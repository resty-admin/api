import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth/guards";
import { RolesGuard } from "../../shared";
import { FiltersArgsDto, PaginationArgsDto } from "../../shared/dtos";
import { CreateUserInput, UpdateUserInput } from "../dtos";
import { PaginatedUser, UserEntity } from "../entities";
import { UsersService } from "../services";

@Resolver(() => UserEntity)
export class UsersResolver {
	constructor(private readonly _usersService: UsersService) {}

	@Query(() => UserEntity)
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
	async user(
		@Args("id", { type: () => String, nullable: true }) id: string,
		@Args("filtersArgs", { type: () => [FiltersArgsDto], nullable: true }) filtersArgs: FiltersArgsDto[]
	) {
		return this._usersService.getUser({ id }, filtersArgs);
	}

	@Query(() => PaginatedUser)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async users(@Args() args: PaginationArgsDto) {
		return this._usersService.getUsers(args);
	}

	@Mutation(() => UserEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async createUser(@Args("user") user: CreateUserInput) {
		return this._usersService.createUser(user);
	}

	@Mutation(() => UserEntity)
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
	async updateUser(@Args("user") user: UpdateUserInput) {
		return this._usersService.updateUser(user.id, user);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteUser(@Args("userId") id: string) {
		return this._usersService.deleteUser(id);
	}
}

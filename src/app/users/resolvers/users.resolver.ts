import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth/guards";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CreateUserInput, UpdateUserInput } from "../dtos";
import { PaginatedUser, UserEntity } from "../entities";
import { UsersService } from "../services";

@Resolver(() => UserEntity)
export class UsersResolver {
	constructor(private readonly _usersService: UsersService) {}

	@Query(() => UserEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async user(@Args("id", { type: () => String }) id: string) {
		return this._usersService.getUser({ id });
	}

	@Query(() => PaginatedUser)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async users(@Args() args: PaginationArgsDto) {
		return this._usersService.getUsers(args);
	}

	@Mutation(() => UserEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createUser(@Args("user") user: CreateUserInput) {
		return this._usersService.createUser(user);
	}

	@Mutation(() => UserEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateUser(@Args("user") user: UpdateUserInput) {
		return this._usersService.updateUser(user.id, user);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteUser(@Args("userId") id: string) {
		return this._usersService.deleteUser(id);
	}
}

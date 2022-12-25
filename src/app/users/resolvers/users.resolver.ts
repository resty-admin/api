import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth/guards";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { PaginatedUser, UserEntity } from "../entities";
import { UsersService } from "../services";

@Resolver(() => UserEntity)
export class UsersResolver {
	constructor(private readonly _tablesService: UsersService) {}

	@Query(() => UserEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async user(@Args("id", { type: () => String }) id: string) {
		return this._tablesService.getUser({ id });
	}

	@Query(() => PaginatedUser)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async users(@Args() args: PaginationArgsDto) {
		return this._tablesService.getUsers(args);
	}
}

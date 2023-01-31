import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CreateHallInput, UpdateHallInput } from "../dtos";
import { HallEntity, PaginatedHall } from "../entities";
import { HallsGuard } from "../guards/halls.guard";
import { HallsService } from "../services";

@Resolver(() => HallEntity)
export class HallsResolver {
	constructor(private readonly _hallsService: HallsService) {}

	@Query(() => HallEntity)
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
	async hall(@Args("id", { type: () => String }) id: string) {
		return this._hallsService.getHall(id);
	}

	@Query(() => PaginatedHall)
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
	async halls(@Args() args: PaginationArgsDto) {
		return this._hallsService.getHalls(args);
	}

	@Mutation(() => HallEntity)
	@UseGuards(GqlJwtGuard, HallsGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async createHall(@Args("hall") hall: CreateHallInput) {
		return this._hallsService.createHall(hall);
	}

	@Mutation(() => HallEntity)
	@UseGuards(GqlJwtGuard, HallsGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async updateHall(@Args("hall") hall: UpdateHallInput) {
		return this._hallsService.updateHall(hall.id, hall);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, HallsGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async deleteHall(@Args("hallId") id: string) {
		return this._hallsService.deleteHall(id);
	}
}

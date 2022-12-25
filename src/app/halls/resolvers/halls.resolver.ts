import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CreateHallInput, UpdateHallInput } from "../dtos";
import { HallEntity, PaginatedHall } from "../entities";
import { HallsService } from "../services";

@Resolver(() => HallEntity)
export class HallsResolver {
	constructor(private readonly _hallsService: HallsService) {}

	@Query(() => HallEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async hall(@Args("id", { type: () => String }) id: string) {
		return this._hallsService.getHall(id);
	}

	@Query(() => PaginatedHall)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async halls(@Args() args: PaginationArgsDto) {
		return this._hallsService.getHalls(args);
	}

	@Mutation(() => HallEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createHall(@Args("hall") hall: CreateHallInput) {
		return this._hallsService.createHall(hall);
	}

	@Mutation(() => HallEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateHall(@Args("hall") hall: UpdateHallInput) {
		return this._hallsService.updateHall(hall.id, hall);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteHall(@Args("hallId") id: string) {
		return this._hallsService.deleteHall(id);
	}
}

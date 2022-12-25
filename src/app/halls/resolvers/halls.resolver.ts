import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
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
}

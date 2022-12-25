import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { ActiveShiftEntity, PaginatedActiveShift } from "../entities";
import { ShiftsService } from "../services";

@Resolver(() => ActiveShiftEntity)
export class ShiftsResolver {
	constructor(private readonly _shiftsService: ShiftsService) {}

	@Query(() => ActiveShiftEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async shift(@Args("id", { type: () => String }) id: string) {
		return this._shiftsService.getShift(id);
	}

	@Query(() => PaginatedActiveShift)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async shifts(@Args() args: PaginationArgsDto) {
		return this._shiftsService.getShifts(args);
	}
}

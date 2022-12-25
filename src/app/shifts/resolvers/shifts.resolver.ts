import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CreateShitInput, UpdateShitInput } from "../dtos";
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

	@Mutation(() => ActiveShiftEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createShift(@Args("shift") shift: CreateShitInput) {
		return this._shiftsService.createShift(shift);
	}

	@Mutation(() => ActiveShiftEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateShift(@Args("shift") shift: UpdateShitInput) {
		return this._shiftsService.updateShift(shift.id, shift);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteShift(@Args("shiftId") id: string) {
		return this._shiftsService.deleteShift(id);
	}
}

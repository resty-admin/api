import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard, UserGql } from "../../shared";
import { FiltersArgsDto, PaginationArgsDto } from "../../shared/dtos";
import { IUser } from "../../shared/interfaces";
import { CreateShiftInput, UpdateShiftInput } from "../dtos";
import { ActiveShiftEntity, PaginatedActiveShift } from "../entities";
import { ShiftsGuard } from "../guards/shifts.guard";
import { ShiftsService } from "../services";

@Resolver(() => ActiveShiftEntity)
export class ShiftsResolver {
	constructor(private readonly _shiftsService: ShiftsService) {}

	@Query(() => ActiveShiftEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async shift(@Args("filtersArgs", { type: () => [FiltersArgsDto] }) filtersArgs: FiltersArgsDto[]) {
		return this._shiftsService.getShift(filtersArgs);
	}

	@Query(() => PaginatedActiveShift)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async shifts(@Args() args: PaginationArgsDto) {
		return this._shiftsService.getShifts(args);
	}

	@Mutation(() => ActiveShiftEntity)
	@UseGuards(
		GqlJwtGuard,
		ShiftsGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async createShift(@Args("shift") shift: CreateShiftInput, @UserGql() user: IUser) {
		return this._shiftsService.createShift(shift, user);
	}

	@Mutation(() => String)
	@UseGuards(
		GqlJwtGuard,
		ShiftsGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async closeShift(@Args("shiftId") shiftId: string) {
		return this._shiftsService.closeShift(shiftId);
	}

	@Query(() => ActiveShiftEntity, { nullable: true })
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async activeShift(@UserGql() user: IUser) {
		return this._shiftsService.getActiveShift(user.id);
	}

	@Mutation(() => ActiveShiftEntity)
	@UseGuards(
		GqlJwtGuard,
		ShiftsGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async updateShift(@Args("shift") shift: UpdateShiftInput) {
		return this._shiftsService.updateShift(shift.id, shift);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, ShiftsGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteShift(@Args("shiftId") id: string) {
		return this._shiftsService.deleteShift(id);
	}
}

import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PlaceVerificationStatusEnum, UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard, UserGql } from "../../shared";
import { FiltersArgsDto, PaginationArgsDto } from "../../shared/dtos";
import { IUser } from "../../shared/interfaces";
import { PaginatedUser } from "../../users/entities";
import { CreatePlaceInput, UpdatePlaceInput } from "../dtos";
import { AddEmployeeInput } from "../dtos/add-employee.dto";
import { PaginatedPlace, PlaceEntity } from "../entities";
import { PlaceGuard } from "../guards";
import { PlaceEmployeeGuard } from "../guards/place-employee.guard";
import { PlacesService } from "../services";

@Resolver(() => PlaceEntity)
export class PlacesResolver {
	constructor(private readonly _placesService: PlacesService) {}

	@Query(() => PlaceEntity)
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
	async place(
		@Args("id", { type: () => String }) id: string,
		@Args("filtersArgs", { type: () => [FiltersArgsDto], nullable: true }) filtersArgs: FiltersArgsDto[]
	) {
		return this._placesService.getPlace(id, filtersArgs);
	}

	@Query(() => PaginatedUser)
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
	async placeGuests(@Args("placeId", { type: () => String }) id: string, @Args() args: PaginationArgsDto) {
		return this._placesService.getPlaceGuests(id, args);
	}

	@Query(() => PaginatedPlace)
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
	async places(@Args() args: PaginationArgsDto, @UserGql() user: IUser) {
		return this._placesService.getPlaces(args, user);
	}

	@Mutation(() => PlaceEntity)
	@UseGuards(GqlJwtGuard, PlaceGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async createPlace(@Args("place") place: CreatePlaceInput) {
		return this._placesService.createPlace(place);
	}

	@Mutation(() => PlaceEntity)
	@UseGuards(GqlJwtGuard, PlaceGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async updatePlace(@Args("place") place: UpdatePlaceInput) {
		return this._placesService.updatePlace(place.id, place);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, PlaceGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async deletePlace(@Args("placeId") id: string) {
		return this._placesService.deletePlace(id);
	}

	@Mutation(() => PlaceEntity)
	@UseGuards(GqlJwtGuard, PlaceEmployeeGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async addEmployeeToPlace(@Args("employeeData") employee: AddEmployeeInput) {
		return this._placesService.addEmployeeToPlace(employee);
	}

	@Mutation(() => PlaceEntity)
	@UseGuards(GqlJwtGuard, PlaceEmployeeGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async removeEmployeeFromPlace(@Args("employeeData") employee: AddEmployeeInput) {
		return this._placesService.removeEmployeeFromPlace(employee);
	}

	@Mutation(() => PlaceEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updatePlaceVerification(
		@Args("placeId") placeId: string,
		@Args("status", { type: () => PlaceVerificationStatusEnum }) status: PlaceVerificationStatusEnum
	) {
		return this._placesService.updatePlaceVerification(placeId, status);
	}
}

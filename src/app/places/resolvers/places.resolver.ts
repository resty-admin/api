import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CreatePlaceInput, UpdatePlaceInput } from "../dtos";
import { PaginatedPlace, PlaceEntity } from "../entities";
import { PlacesService } from "../services";

@Resolver(() => PlaceEntity)
export class PlacesResolver {
	constructor(private readonly _placesService: PlacesService) {}

	@Query(() => PlaceEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async place(@Args("id", { type: () => String }) id: string) {
		return this._placesService.getPlace(id);
	}

	@Query(() => PaginatedPlace)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async places(@Args() args: PaginationArgsDto) {
		return this._placesService.getPlaces(args);
	}

	@Mutation(() => PlaceEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createPlace(@Args("place") place: CreatePlaceInput) {
		console.log("here", place);
		return this._placesService.createPlace(place);
	}

	@Mutation(() => PlaceEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updatePlace(@Args("place") place: UpdatePlaceInput) {
		return this._placesService.updatePlace(place.id, place);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deletePlace(@Args("placeId") id: string) {
		return this._placesService.deletePlace(id);
	}
}

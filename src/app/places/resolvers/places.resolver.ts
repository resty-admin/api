import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
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
}

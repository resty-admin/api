import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { UserRoleEnum } from "src/app/shared/enums";

import { JwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PLACES } from "../constant";
import { CreatePlaceDto, UpdatePlaceDto } from "../dtos";
import { PlaceEntity } from "../entities";
import { PlaceGuard } from "../guards";
import { PlacesService } from "../services";

@Controller(PLACES)
export class PlacesController {
	constructor(private readonly _placesService: PlacesService) {}

	@Post()
	@ApiOperation({ summary: `Create place` })
	@ApiCreatedResponse({
		description: "The record has been successfully created.",
		type: PlaceEntity
	})
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createPlace(@Body() place: CreatePlaceDto): Promise<PlaceEntity> {
		return this._placesService.createPlace(place);
	}

	@Patch("/:id")
	@ApiOperation({ summary: `Update place` })
	@ApiCreatedResponse({
		description: "The record has been successfully updated.",
		type: PlaceEntity
	})
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]), PlaceGuard)
	async updatePlace(@Param("id", ParseUUIDPipe) id: string, @Body() place: UpdatePlaceDto): Promise<PlaceEntity> {
		return this._placesService.updatePlace(id, place);
	}

	@Delete("/:id")
	@ApiOperation({ summary: `Delete place` })
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]), PlaceGuard)
	async deletePlace(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
		return this._placesService.deletePlace(id);
	}
}

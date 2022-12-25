import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { UserRoleEnum } from "src/app/shared/enums";

import { JwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { HALLS } from "../constant";
import { CreateHallDto, UpdateHallDto } from "../dtos";
import { HallEntity } from "../entities";
import { HallsService } from "../services";

@Controller(HALLS)
export class HallsController {
	constructor(private readonly _hallsService: HallsService) {}

	@Post()
	@ApiOperation({ summary: `Create hall` })
	@ApiCreatedResponse({
		description: "The record has been successfully created.",
		type: HallEntity
	})
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createCompany(@Body() hall: CreateHallDto): Promise<HallEntity> {
		return this._hallsService.createHall(hall);
	}

	@Patch("/:id")
	@ApiOperation({ summary: `Update hall` })
	@ApiCreatedResponse({
		description: "The record has been successfully updated.",
		type: HallEntity
	})
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateCompany(@Param("id", ParseUUIDPipe) id: string, @Body() hall: UpdateHallDto): Promise<HallEntity> {
		return this._hallsService.updateHall(id, hall);
	}

	@Delete("/:id")
	@ApiOperation({ summary: `Delete hall` })
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteCompany(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
		return this._hallsService.deleteHall(id);
	}
}

import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

import { ACTIVE_SHIFTS } from "../constants";
import { CreateShiftDto, UpdateShiftDto } from "../dtos";
import { ActiveShiftEntity } from "../entities";
import { ShiftsService } from "../services";

@Controller(ACTIVE_SHIFTS)
export class ShiftsController {
	constructor(private readonly _shiftsService: ShiftsService) {}

	@Post()
	@ApiOperation({ summary: `Create shift` })
	@ApiCreatedResponse({
		description: "The record has been successfully created.",
		type: ActiveShiftEntity
	})
	async createShift(@Body() shift: CreateShiftDto): Promise<ActiveShiftEntity> {
		return this._shiftsService.createShift(shift);
	}

	@Patch("/:id")
	@ApiOperation({ summary: `Update shift` })
	@ApiCreatedResponse({
		description: "The record has been successfully updated.",
		type: ActiveShiftEntity
	})
	async updateShift(@Param("id", ParseUUIDPipe) id: string, @Body() shift: UpdateShiftDto): Promise<ActiveShiftEntity> {
		return this._shiftsService.updateShift(id, shift);
	}

	@Delete("/:id")
	@ApiOperation({ summary: `Delete shift` })
	async deleteShift(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
		return this._shiftsService.deleteShift(id);
	}
}

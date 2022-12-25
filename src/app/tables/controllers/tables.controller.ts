import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { UserRoleEnum } from "src/app/shared/enums";

import { JwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { TABLES } from "../constant";
import { CreateTableDto, UpdateTableDto } from "../dtos";
import { TableEntity } from "../entities";
import { TablesService } from "../services";

@Controller(TABLES)
export class TablesController {
	constructor(private readonly _tablesService: TablesService) {}

	@Post()
	@ApiOperation({ summary: `Create table` })
	@ApiCreatedResponse({
		description: "The record has been successfully created.",
		type: TableEntity
	})
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createTable(@Body() table: CreateTableDto): Promise<TableEntity> {
		return this._tablesService.createTable(table);
	}

	@Patch("/:id")
	@ApiOperation({ summary: `Update table` })
	@ApiCreatedResponse({
		description: "The record has been successfully updated.",
		type: TableEntity
	})
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateTable(@Param("id", ParseUUIDPipe) id: string, @Body() table: UpdateTableDto): Promise<TableEntity> {
		return this._tablesService.updateTable(id, table);
	}

	@Delete("/:id")
	@ApiOperation({ summary: `Delete table` })
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteTable(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
		return this._tablesService.deleteTable(id);
	}
}

import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { UserRoleEnum } from "src/app/shared/enums";

import { JwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { LANGUAGES } from "../constants";
import { CreateLanguageDto, UpdateLanguageDto } from "../dtos";
import { LanguageEntity } from "../entities";
import { LanguagesService } from "../services";

@Controller(LANGUAGES)
export class LanguagesController {
	constructor(private readonly _languagesService: LanguagesService) {}

	// @Post()
	// @ApiOperation({ summary: `Create language` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully created.",
	// 	type: LanguageEntity
	// })
	// @UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	// async refreshLangauges(@Body() company: CreateLanguageDto): Promise<LanguageEntity> {
	// 	return this._i18nService.refreshLanguages();
	// }

	@Post()
	@ApiOperation({ summary: `Create language` })
	@ApiCreatedResponse({
		description: "The record has been successfully created.",
		type: LanguageEntity
	})
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createLanguage(@Body() company: CreateLanguageDto): Promise<LanguageEntity> {
		return this._languagesService.createLanguage(company);
	}

	@Patch("/:id")
	@ApiOperation({ summary: `Update language` })
	@ApiCreatedResponse({
		description: "The record has been successfully updated.",
		type: LanguageEntity
	})
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateLanguage(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() company: UpdateLanguageDto
	): Promise<LanguageEntity> {
		return this._languagesService.updateLanguage(id, company);
	}

	@Delete("/:id")
	@ApiOperation({ summary: `Delete language` })
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteLanguage(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
		return this._languagesService.deleteLanguage(id);
	}
}

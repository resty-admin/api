import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { UserRoleEnum } from "src/app/shared/enums";
import { IUser } from "src/app/shared/interfaces";

import { JwtGuard } from "../../auth";
import { User } from "../../shared";
import { RolesGuard } from "../../shared";
import { COMPANIES } from "../constant";
import { CreateCompanyDto, UpdateCompanyDto } from "../dtos";
import { CompanyEntity } from "../entities";
import { CompaniesService } from "../services";

@Controller(COMPANIES)
export class CompaniesController {
	constructor(private readonly _companiesService: CompaniesService) {}

	@Post()
	@ApiOperation({ summary: `Create company` })
	@ApiCreatedResponse({
		description: "The record has been successfully created1.",
		type: CompanyEntity
	})
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createCompany(@Body() company: CreateCompanyDto, @User() user: IUser): Promise<CompanyEntity> {
		return this._companiesService.createCompany(company, user);
	}

	@Patch("/:id")
	@ApiOperation({ summary: `Update company` })
	@ApiCreatedResponse({
		description: "The record has been successfully updated.",
		type: CompanyEntity
	})
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateCompany(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() company: UpdateCompanyDto
	): Promise<CompanyEntity> {
		return this._companiesService.updateCompany(id, company);
	}

	@Delete("/:id")
	@ApiOperation({ summary: `Delete company` })
	@UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteCompany(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
		return this._companiesService.deleteCompany(id);
	}
}

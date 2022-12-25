import { Controller } from "@nestjs/common";

import { COMPANIES } from "../constant";

@Controller(COMPANIES)
export class CompaniesController {
	// constructor(private readonly _companiesService: CompaniesService) {}
	// @Post()
	// @ApiOperation({ summary: `Create company` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully created1.",
	// 	type: CompanyEntity
	// })
	// @UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	// async createCompany(@Body() company: CreateCompanyDto, @User() user: IUser): Promise<CompanyEntity> {
	// 	return this._companiesService.createCompany(company, user);
	// }
	//
	// @Patch("/:id")
	// @ApiOperation({ summary: `Update company` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully updated.",
	// 	type: CompanyEntity
	// })
	// @UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	// async updateCompany(
	// 	@Param("id", ParseUUIDPipe) id: string,
	// 	@Body() company: UpdateCompanyDto
	// ): Promise<CompanyEntity> {
	// 	return this._companiesService.updateCompany(id, company);
	// }
	//
	// @Delete("/:id")
	// @ApiOperation({ summary: `Delete company` })
	// @UseGuards(JwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	// async deleteCompany(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
	// 	return this._companiesService.deleteCompany(id);
	// }
}

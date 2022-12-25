import { Controller } from "@nestjs/common";

import { ACCOUNTING_SYSTEMS } from "../constant";

@Controller(ACCOUNTING_SYSTEMS)
export class AccountingSystemsController {
	// constructor(private readonly _accountingSystemsService: AccountingSystemsService) {}
	// @Post()
	// @ApiOperation({ summary: `Create accounting system` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully created.",
	// 	type: AccountingSystemEntity
	// })
	// async createAccountingSystem(
	// 	@Body() accountingSystemDto: CreateAccountingSystemDto
	// ): Promise<AccountingSystemEntity> {
	// 	return this._accountingSystemsService.creatAccountingSystem(accountingSystemDto);
	// }
	//
	// @Patch("/:id")
	// @ApiOperation({ summary: `Update accounting system` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully updated.",
	// 	type: AccountingSystemEntity
	// })
	// async updateAccountingSystem(
	// 	@Param("id", ParseUUIDPipe) id: string,
	// 	@Body() accountingSystemDto: UpdateAccountingSystemDto
	// ): Promise<AccountingSystemEntity> {
	// 	return this._accountingSystemsService.updateAccountingSystem(id, accountingSystemDto);
	// }
	//
	// @Delete("/:id")
	// @ApiOperation({ summary: `Delete accounting system` })
	// async deleteAccountingSystem(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
	// 	return this._accountingSystemsService.deleteAccountingSystem(id);
	// }
}

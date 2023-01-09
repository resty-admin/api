import { Controller } from "@nestjs/common";

import { COMMANDS } from "../constant";
import { CommandsService } from "../services";

@Controller(COMMANDS)
export class CommandsController {
	constructor(private readonly _commandsService: CommandsService) {}

	// @Post("/emit-command")
	// async emitCommand(@Body() body: EmitCommandDto) {
	// 	await this._commandsService.emitCommand(body);
	// }

	// @Post()
	// @ApiOperation({ summary: `Create command` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully created.",
	// 	type: CommandEntity
	// })
	// async createCommand(@Body() command: CreateCommandDto): Promise<CommandEntity> {
	// 	return this._commandsService.createCommand(command);
	// }
	//
	// @Patch("/:id")
	// @ApiOperation({ summary: `Update command` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully updated.",
	// 	type: CommandEntity
	// })
	// async updateUser(@Param("id", ParseUUIDPipe) id: string, @Body() command: UpdateCommandDto): Promise<CommandEntity> {
	// 	return this._commandsService.updateCommand(id, command);
	// }
	//
	// @Delete("/:id")
	// @ApiOperation({ summary: `Delete command` })
	// async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
	// 	return this._commandsService.deleteCommand(id);
	// }
}

import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { UserRoleEnum } from "../../shared/enums";
import { CreateCommandInput, UpdateCommandInput } from "../dtos";
import { CommandEntity, PaginatedCommand } from "../entities";
import { CommandsGuard } from "../guards/commands.guard";
import { CommandsService } from "../services";

@Resolver(() => CommandEntity)
export class CommandsResolver {
	constructor(private readonly _commandsService: CommandsService) {}

	@Query(() => CommandEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.CLIENT,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async command(@Args("id", { type: () => String }) id: string) {
		return this._commandsService.getCommand(id);
	}

	@Query(() => PaginatedCommand)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.CLIENT,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async commands(@Args() args: PaginationArgsDto) {
		return this._commandsService.getCommands(args);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async emitCommand(@Args("commandId") commandId: string, @Args("orderId") orderId: string) {
		return this._commandsService.emitCommand(commandId, orderId);
	}

	@Mutation(() => CommandEntity)
	@UseGuards(GqlJwtGuard, CommandsGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async createCommand(@Args("command") command: CreateCommandInput) {
		return this._commandsService.createCommand(command);
	}

	@Mutation(() => CommandEntity)
	@UseGuards(GqlJwtGuard, CommandsGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async updateCommand(@Args("command") command: UpdateCommandInput) {
		return this._commandsService.updateCommand(command.id, command);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, CommandsGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async deleteCommand(@Args("commandId") id: string) {
		return this._commandsService.deleteCommand(id);
	}
}

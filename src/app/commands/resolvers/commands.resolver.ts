import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard, UserGql } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CreateCommandInput } from "../dtos";
import { CommandEntity, PaginatedCommand } from "../entities";
import { CommandsService } from "../services";
import {UserRoleEnum} from "../../shared/enums";
import {IUser} from "../../shared/interfaces";

@Resolver(() => CommandEntity)
export class CommandsResolver {
	constructor(private readonly _commandsService: CommandsService) {}

	@Query(() => CommandEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async command(@Args("id", { type: () => String }) id: string) {
		return this._commandsService.getCommand(id);
	}

	@Query(() => PaginatedCommand)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async commands(@Args() args: PaginationArgsDto) {
		return this._commandsService.getCommands(args);
	}

	@Mutation(() => CommandEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createCommand(@Args("command") command: CreateCommandInput) {
		return this._commandsService.createCommand(command);
	}

	@Mutation(() => CommandEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateCommand(@Args("command") command: string, @UserGql() user: IUser) {
		return this._commandsService.updateCommand(command, user);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteCommand(@Args("commandId") id: string) {
		return this._commandsService.deleteCommand(id);
	}
}

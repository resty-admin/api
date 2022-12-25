import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CommandEntity, PaginatedCommand } from "../entities";
import { CommandsService } from "../services";

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
}

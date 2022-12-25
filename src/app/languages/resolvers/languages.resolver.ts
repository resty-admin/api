import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { LanguageEntity } from "../entities";
import { LanguagesService } from "../services";

@Resolver(() => LanguageEntity)
export class LanguagesResolver {
	constructor(private readonly _languagesService: LanguagesService) {}

	@Query(() => LanguageEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async language(@Args("id", { type: () => String }) id: string) {
		return this._languagesService.getLanguage(id);
	}

	@Query(() => LanguageEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async languages(@Args() args: PaginationArgsDto) {
		return this._languagesService.getLanguages(args);
	}
}

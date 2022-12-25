import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { AttributesGroupEntity, PaginatedAttributeGroups } from "../entities";
import { AttributeGroupsService } from "../services";

@Resolver(() => AttributesGroupEntity)
export class AttributeGroupsResolver {
	constructor(private readonly _attributeGroupsService: AttributeGroupsService) {}

	@Query(() => AttributesGroupEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async attributeGroup(@Args("id", { type: () => String }) id: string) {
		return this._attributeGroupsService.getAttributeGroup(id);
	}

	@Query(() => PaginatedAttributeGroups)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async attributeGroups(@Args() args: PaginationArgsDto) {
		return this._attributeGroupsService.getAttributeGroups(args);
	}
}

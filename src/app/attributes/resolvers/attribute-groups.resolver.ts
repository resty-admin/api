import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CreateAttributeGroupInput, UpdateAttributeGroupInput } from "../dtos";
import { AttributesGroupEntity, PaginatedAttributeGroups } from "../entities";
import { AttributesGroupGuard } from "../guards/attributes-group.guard";
import { AttributeGroupsService } from "../services";

@Resolver(() => AttributesGroupEntity)
export class AttributeGroupsResolver {
	constructor(private readonly _attributeGroupsService: AttributeGroupsService) {}

	@Query(() => AttributesGroupEntity)
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
	async attributeGroup(@Args("id", { type: () => String }) id: string) {
		return this._attributeGroupsService.getAttributeGroup(id);
	}

	@Query(() => PaginatedAttributeGroups)
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
	async attributeGroups(@Args() args: PaginationArgsDto) {
		return this._attributeGroupsService.getAttributeGroups(args);
	}

	@Mutation(() => AttributesGroupEntity)
	@UseGuards(GqlJwtGuard, AttributesGroupGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async createAttrGroup(@Args("attrGroup") attrGroup: CreateAttributeGroupInput) {
		return this._attributeGroupsService.createAttributeGroup(attrGroup);
	}

	@Mutation(() => AttributesGroupEntity)
	@UseGuards(GqlJwtGuard, AttributesGroupGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async updateAttrGroup(@Args("attrGroup") attrGroup: UpdateAttributeGroupInput) {
		return this._attributeGroupsService.updateAttributeGroup(attrGroup.id, attrGroup);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, AttributesGroupGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async deleteAttrGroup(@Args("attrGroupId") id: string) {
		return this._attributeGroupsService.deleteAttributeGroup(id);
	}
}

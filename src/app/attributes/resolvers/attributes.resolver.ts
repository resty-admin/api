import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CreateAttributeInput, UpdateAttributeInput } from "../dtos";
import { AttributesEntity, PaginatedAttributes } from "../entities";
import { AttributesService } from "../services";

@Resolver(() => AttributesEntity)
export class AttributesResolver {
	constructor(private readonly _attributesService: AttributesService) {}

	@Query(() => AttributesEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async attribute(@Args("id", { type: () => String }) id: string) {
		return this._attributesService.getAttribute(id);
	}

	@Query(() => PaginatedAttributes)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async attributes(@Args() args: PaginationArgsDto) {
		return this._attributesService.getAttributes(args);
	}

	@Mutation(() => AttributesEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createAttr(@Args("attr") attr: CreateAttributeInput) {
		return this._attributesService.createAttribute(attr);
	}

	@Mutation(() => AttributesEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateAttr(@Args("attr") attr: UpdateAttributeInput) {
		return this._attributesService.updateAttribute(attr.id, attr);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteAttr(@Args("attrId") id: string) {
		return this._attributesService.deleteAttribute(id);
	}
}

import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

import { ATTRIBUTE_GROUPS } from "../constant";
import { CreateAttributeGroupDto, UpdateAttributeGroupDto } from "../dtos";
import { AttributesGroupEntity } from "../entities";
import { AttributeGroupsService } from "../services";

@Controller(ATTRIBUTE_GROUPS)
export class AttributeGroupsController {
	constructor(private readonly _attributeGroupsService: AttributeGroupsService) {}

	@Post()
	@ApiOperation({ summary: `Create attribute group` })
	@ApiCreatedResponse({
		description: "The record has been successfully created.",
		type: AttributesGroupEntity
	})
	async createAttributeGroup(@Body() attributeGroupDto: CreateAttributeGroupDto): Promise<AttributesGroupEntity> {
		return this._attributeGroupsService.createAttributeGroup(attributeGroupDto);
	}

	@Patch("/:id")
	@ApiOperation({ summary: `Update attribute group` })
	@ApiCreatedResponse({
		description: "The record has been successfully updated.",
		type: AttributesGroupEntity
	})
	async updateAttributeGroup(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() attributeGroupDto: UpdateAttributeGroupDto
	): Promise<AttributesGroupEntity> {
		return this._attributeGroupsService.updateAttributeGroup(id, attributeGroupDto);
	}

	@Delete("/:id")
	@ApiOperation({ summary: `Delete attribute group` })
	async deleteAttributeGroup(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
		return this._attributeGroupsService.deleteAttributeGroup(id);
	}
}

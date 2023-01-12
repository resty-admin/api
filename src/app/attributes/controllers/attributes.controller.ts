import { Controller } from "@nestjs/common";

import { ATTRIBUTES } from "../constant";

@Controller(ATTRIBUTES)
export class AttributesController {
	// constructor(private readonly _attributesService: AttributesService) {}
	//
	// @Post()
	// @ApiOperation({ summary: `Create attribute` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully created.",
	// 	type: AttributesEntity
	// })
	// async createAttribute(@Body() attribute: CreateAttributeDto): Promise<AttributesEntity> {
	// 	return this._attributesService.createAttribute(attribute);
	// }
	//
	// @Patch("/:id")
	// @ApiOperation({ summary: `Update attribute` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully updated.",
	// 	type: AttributesEntity
	// })
	// async updateAttribute(
	// 	@Param("id", ParseUUIDPipe) id: string,
	// 	@Body() attribute: UpdateAttributeDto
	// ): Promise<AttributesEntity> {
	// 	return this._attributesService.updateAttribute(id, attribute);
	// }
	//
	// @Delete("/:id")
	// @ApiOperation({ summary: `Delete attribute` })
	// async deleteAttribute(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
	// 	return this._attributesService.deleteAttribute(id);
	// }
}

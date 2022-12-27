import { Controller } from "@nestjs/common";

import { CATEGORIES } from "../constants";

@Controller(CATEGORIES)
export class CategoriesController {
	// constructor(private readonly _categoriesService: CategoriesService) {}
	// @Post()
	// @ApiOperation({ summary: `Create c ategory` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully created.",
	// 	type: CategoryEntity
	// })
	// async createCategory(@Body() category: CreateCategoryDto): Promise<CategoryEntity> {
	// 	return this._categoriesService.createCategory(category);
	// }
	//
	// @Patch("/:id")
	// @ApiOperation({ summary: `Update category` })
	// @ApiCreatedResponse({
	// 	description: "The record has been successfully updated.",
	// 	type: CategoryEntity
	// })
	// async updateCategory(
	// 	@Param("id", ParseUUIDPipe) id: string,
	// 	@Body() category: UpdateCategoryDto
	// ): Promise<CategoryEntity> {
	// 	return this._categoriesService.updateCategory(id, category);
	// }
	//
	// @Delete("/:id")
	// @ApiOperation({ summary: `Delete category` })
	// async deleteCategory(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
	// 	return this._categoriesService.deleteCategory(id);
	// }
}

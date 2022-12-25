import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

import { PRODUCTS } from "../constant";
import { CreateProductDto, UpdateProductDto } from "../dtos";
import { ProductEntity } from "../entities";
import { ProductsService } from "../services";

@Controller(PRODUCTS)
export class ProductsController {
	constructor(private readonly _productsService: ProductsService) {}

	@Post()
	@ApiOperation({ summary: `Create product` })
	@ApiCreatedResponse({
		description: "The record has been successfully created.",
		type: ProductEntity
	})
	async createProduct(@Body() product: CreateProductDto): Promise<ProductEntity> {
		return this._productsService.createProduct(product);
	}

	@Patch("/:id")
	@ApiOperation({ summary: `Update product` })
	@ApiCreatedResponse({
		description: "The record has been successfully updated.",
		type: ProductEntity
	})
	async updateCommand(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() product: UpdateProductDto
	): Promise<ProductEntity> {
		return this._productsService.updateProduct(id, product);
	}

	@Delete("/:id")
	@ApiOperation({ summary: `Delete product` })
	async deleteCommand(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
		return this._productsService.deleteProduct(id);
	}
}

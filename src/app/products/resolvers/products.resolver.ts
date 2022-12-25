import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { UserRoleEnum } from "../../shared/enums";
import { CreateProductInput, UpdateProductInput } from "../dtos";
import { PaginatedProduct, ProductEntity } from "../entities";
import { ProductsService } from "../services";

@Resolver(() => ProductEntity)
export class ProductsResolver {
	constructor(private readonly _productsService: ProductsService) {}

	@Query(() => ProductEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async product(@Args("id", { type: () => String }) id: string) {
		return this._productsService.getProduct(id);
	}

	@Query(() => PaginatedProduct)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async products(@Args() args: PaginationArgsDto) {
		return this._productsService.getProducts(args);
	}

	@Mutation(() => ProductEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createProduct(@Args("product") product: CreateProductInput) {
		return this._productsService.createProduct(product);
	}

	@Mutation(() => ProductEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateProduct(@Args("product") product: UpdateProductInput) {
		return this._productsService.updateProduct(product.id, product);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteProduct(@Args("productId") id: string) {
		return this._productsService.deleteProduct(id);
	}
}

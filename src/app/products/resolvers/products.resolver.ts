import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
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
}

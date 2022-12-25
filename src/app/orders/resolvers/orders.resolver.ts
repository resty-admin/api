import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { ActiveOrderEntity, PaginatedActiveOrder } from "../entities";
import { OrdersService } from "../services";

@Resolver(() => ActiveOrderEntity)
export class OrdersResolver {
	constructor(private readonly _ordersService: OrdersService) {}

	@Query(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async order(@Args("id", { type: () => String }) id: string) {
		return this._ordersService.getOrder(id);
	}

	@Query(() => PaginatedActiveOrder)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async orders(@Args() args: PaginationArgsDto) {
		return this._ordersService.getOrders(args);
	}
}

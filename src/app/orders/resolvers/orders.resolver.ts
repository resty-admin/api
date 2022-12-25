import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CreateOrderInput, UpdateOrderInput } from "../dtos";
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

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createOrder(@Args("order") order: CreateOrderInput) {
		return this._ordersService.creatOrder(order);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateOrder(@Args("order") order: UpdateOrderInput) {
		return this._ordersService.updateOrder(order.id, order);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteOrder(@Args("orderId") id: string) {
		return this._ordersService.deleteOrder(id);
	}
}

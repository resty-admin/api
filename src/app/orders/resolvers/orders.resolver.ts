import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard, UserGql } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { IUser } from "../../shared/interfaces";
import { CreateOrderInput, CreateUserToOrderInput, UpdateOrderInput, UpdateUserToOrderInput } from "../dtos";
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
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
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

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async addProductToOrder(@Args("orderId") id: string, @Args("product") product: CreateUserToOrderInput) {
		return this._ordersService.addProductToOrder(id, product);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async removeUserProductInOrder(@Args("userToOrderId") id: string) {
		return this._ordersService.removeUserProductInOrder(id);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updateUserProductInOrder(@Args("userToOrder") userToOrder: UpdateUserToOrderInput) {
		return this._ordersService.updateUserProductInOrder(userToOrder);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async addUserToOrder(
		@Args("placeId") placeId: string,
		@Args({ name: "orderCode", type: () => Int }) orderCode: number,
		@UserGql() user: IUser
	) {
		return this._ordersService.addUserToOrder(placeId, orderCode, user.id);
	}
}

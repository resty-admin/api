import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard, UserGql } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { IUser } from "../../shared/interfaces";
import { CreateOrderInput, RemoveProductFromOrderInput, UpdateOrderInput } from "../dtos";
import { AddProductToOrderInput } from "../dtos/add-product-to-order.dto";
import { ActiveOrderEntity, PaginatedActiveOrder, PaginatedHistoryOrder } from "../entities";
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

	@Query(() => PaginatedHistoryOrder)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async historyOrders(@Args() args: PaginationArgsDto) {
		return this._ordersService.getHistoryOrders(args);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async createOrder(@Args("order") order: CreateOrderInput, @UserGql() user: IUser) {
		return this._ordersService.creatOrder(order, user);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async updateOrder(@Args("order") order: UpdateOrderInput) {
		return this._ordersService.updateOrder(order.id, order);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteOrder(@Args("orderId") id: string) {
		return this._ordersService.deleteOrder(id);
	}

	// @Mutation(() => ActiveOrderEntity)
	// @UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	// async addProductToOrder(@Args("orderId") id: string, @Args("product") product: CreateUserToOrderInput) {
	// 	return this._ordersService.addProductToOrder(id, product);
	// }

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async addProductToOrder(@Args("productToOrder") productToOrder: AddProductToOrderInput, @UserGql() user: IUser) {
		return this._ordersService.addProductToOrder(productToOrder, user);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async removeProductFromOrder(
		@Args("productFromOrder") productFromOrder: RemoveProductFromOrderInput,
		@UserGql() user: IUser
	) {
		return this._ordersService.removeProductFromOrder(productFromOrder, user);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.CLIENT, UserRoleEnum.ADMIN]))
	async addUserToOrder(@Args({ name: "code", type: () => Int }) code: number, @UserGql() user: IUser) {
		return this._ordersService.addUserToOrder(code, user);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.CLIENT, UserRoleEnum.ADMIN]))
	async addTableToOrder(@Args("orderId") orderId: string, @Args("tableId") tableId: string) {
		return this._ordersService.addTableToOrder(orderId, tableId);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.CLIENT, UserRoleEnum.ADMIN]))
	async removeTableFromOrder(@Args("orderId") orderId: string) {
		return this._ordersService.removeTableFrom(orderId);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async closeOrder(@Args("orderId") orderId: string) {
		return this._ordersService.closeOrder(orderId);
	}
}

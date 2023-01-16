import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard, UserGql } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { IUser } from "../../shared/interfaces";
import { CreateOrderInput, RemoveProductFromOrderInput, UpdateOrderInput } from "../dtos";
import { AddProductToOrderInput } from "../dtos/add-product-to-order.dto";
import { ActiveOrderEntity, PaginatedActiveOrder, PaginatedHistoryOrder, ProductToOrderEntity } from "../entities";
import { OrdersService, ProductToOrderService } from "../services";

@Resolver(() => ActiveOrderEntity)
export class OrdersResolver {
	constructor(
		private readonly _ordersService: OrdersService,
		private readonly _productToOrderService: ProductToOrderService
	) {}

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
		return this._productToOrderService.addProductToOrder(productToOrder, user);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async removeProductFromOrder(
		@Args("productFromOrder") productFromOrder: RemoveProductFromOrderInput,
		@UserGql() user: IUser
	) {
		return this._productToOrderService.removeProductFromOrder(productFromOrder, user);
	}

	@Mutation(() => [ProductToOrderEntity])
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT, UserRoleEnum.WAITER]))
	async rejectProductsInOrder(@Args("productToOrderIds", { type: () => [String] }) productToOrderIds: string[]) {
		return this._productToOrderService.rejectProductInOrder(productToOrderIds);
	}

	@Mutation(() => [ProductToOrderEntity])
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT, UserRoleEnum.WAITER]))
	async approveProductsInOrder(@Args("productToOrderIds", { type: () => [String] }) productToOrderIds: string[]) {
		return this._productToOrderService.approveProductInOrder(productToOrderIds);
	}

	@Mutation(() => [ProductToOrderEntity])
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT, UserRoleEnum.WAITER]))
	async setManualPayForProductsInOrder(
		@Args("productToOrderIds", { type: () => [String] }) productToOrderIds: string[]
	) {
		return this._productToOrderService.setManualPayForProductsInOrder(productToOrderIds);
	}

	@Mutation(() => [ProductToOrderEntity])
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT, UserRoleEnum.WAITER]))
	async setPaidStatusForProductsInOrder(
		@Args("productToOrderIds", { type: () => [String] }) productToOrderIds: string[]
	) {
		return this._productToOrderService.setPaidStatusForProductsInOrder(productToOrderIds);
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
	async approveTableInOrder(@Args("orderId") orderId: string) {
		return this._ordersService.approveTableInOrder(orderId);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.CLIENT, UserRoleEnum.ADMIN]))
	async rejectTableInOrder(@Args("orderId") orderId: string) {
		return this._ordersService.rejectTableInOrder(orderId);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.CLIENT, UserRoleEnum.ADMIN]))
	async removeTableFromOrder(@Args("orderId") orderId: string) {
		return this._ordersService.removeTableFrom(orderId);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async confirmOrder(@Args("orderId") orderId: string, @UserGql() user: IUser) {
		return this._ordersService.confirmOrder(orderId, user);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async closeOrder(@Args("orderId") orderId: string) {
		return this._ordersService.closeOrder(orderId);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.CLIENT]))
	async cancelOrder(@Args("orderId") orderId: string) {
		return this._ordersService.cancelOrder(orderId);
	}
}

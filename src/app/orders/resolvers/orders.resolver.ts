import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard, UserGql } from "../../shared";
import { FiltersArgsDto, PaginationArgsDto } from "../../shared/dtos";
import { IUser } from "../../shared/interfaces";
import { ConfirmProductToOrderInput, CreateOrderInput, UpdateOrderInput } from "../dtos";
import {
	ActiveOrderEntity,
	HistoryOrderEntity,
	PaginatedActiveOrder,
	PaginatedHistoryOrder,
	ProductToOrderEntity
} from "../entities";
import { ORDERS_EVENTS } from "../gateways/events/order.event";
import { OrdersGuard } from "../guards/orders.guard";
import { OrdersService, ProductToOrderService } from "../services";

@Resolver(() => ActiveOrderEntity)
export class OrdersResolver {
	constructor(
		private readonly _ordersService: OrdersService,
		private readonly _productToOrderService: ProductToOrderService
	) {}

	@Query(() => ActiveOrderEntity, { nullable: true })
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async order(
		@Args("id", { type: () => String, nullable: true }) id: string,
		@Args("filtersArgs", { type: () => [FiltersArgsDto], nullable: true }) filtersArgs: FiltersArgsDto[]
	) {
		return this._ordersService.getOrder(id, filtersArgs);
	}

	@Query(() => PaginatedActiveOrder)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async orders(@Args() args: PaginationArgsDto, @UserGql() user: IUser) {
		return this._ordersService.getOrders(args, user);
	}

	@Query(() => ORDERS_EVENTS)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async ordersEvents() {
		return ORDERS_EVENTS;
	}

	@Query(() => HistoryOrderEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async historyOrder(@Args("id", { type: () => String }) id: string) {
		return this._ordersService.getHistoryOrder(id);
	}

	@Query(() => PaginatedHistoryOrder)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async historyOrders(@Args("placeId") placeId: string, @Args() args: PaginationArgsDto) {
		return this._ordersService.getHistoryOrders(placeId, args);
	}

	@Query(() => HistoryOrderEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async clientHistoryOrder(@UserGql() user: IUser, @Args("orderId") orderId: string) {
		return this._ordersService.clientHistoryOrder(user, orderId);
	}

	@Query(() => PaginatedHistoryOrder)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async clientHistoryOrders(@UserGql() user: IUser, @Args() args: PaginationArgsDto) {
		return this._ordersService.clientHistoryOrders(user, args);
	}

	@Query(() => Boolean)
	@UseGuards(GqlJwtGuard)
	async isTimeAvailable(@Args("date") date: Date, @Args("placeId") placeId: string) {
		return this._ordersService.isTimeAvailable(date, placeId);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.CLIENT
		])
	)
	async createOrder(@Args("order") order: CreateOrderInput, @UserGql() user: IUser) {
		return this._ordersService.createOrder(order, user);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(
		GqlJwtGuard,
		// OrdersGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.CLIENT
		])
	)
	async updateOrder(@Args("order") order: UpdateOrderInput) {
		return this._ordersService.updateOrder(order.id, order);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, OrdersGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deleteOrder(@Args("orderId") id: string) {
		return this._ordersService.deleteOrder(id);
	}

	// @Mutation(() => ActiveOrderEntity)
	// @UseGuards(
	// 	GqlJwtGuard,
	// 	RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAITER, UserRoleEnum.CLIENT])
	// )
	// async addProductToOrder(@Args("productToOrder") productToOrder: AddProductToOrderInput, @UserGql() user: IUser) {
	// 	return this._productToOrderService.addProductToOrder(productToOrder, user);
	// }

	// @Mutation(() => ActiveOrderEntity)
	// @UseGuards(
	// 	GqlJwtGuard,
	// 	RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAITER, UserRoleEnum.CLIENT])
	// )
	// async removeProductFromOrder(
	// 	@Args("productFromOrder") productFromOrder: RemoveProductFromOrderInput,
	// 	@UserGql() user: IUser
	// ) {
	// 	return this._productToOrderService.removeProductFromOrder(productFromOrder, user);
	// }

	@Mutation(() => [ProductToOrderEntity])
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAITER]))
	async rejectProductsInOrder(@Args("productToOrderIds", { type: () => [String] }) productToOrderIds: string[]) {
		return this._productToOrderService.rejectProductInOrder(productToOrderIds);
	}

	@Mutation(() => [ProductToOrderEntity])
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAITER]))
	async approveProductsInOrder(@Args("productToOrderIds", { type: () => [String] }) productToOrderIds: string[]) {
		return this._productToOrderService.approveProductInOrder(productToOrderIds);
	}

	@Mutation(() => [ProductToOrderEntity])
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async setManualPayForProductsInOrder(
		@Args("productToOrderIds", { type: () => [String] }) productToOrderIds: string[]
	) {
		return this._productToOrderService.setManualPayForProductsInOrder(productToOrderIds);
	}

	@Mutation(() => [ProductToOrderEntity])
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH
		])
	)
	async setPaidStatusForProductsInOrder(
		@Args("productToOrderIds", { type: () => [String] }) productToOrderIds: string[]
	) {
		return this._productToOrderService.setPaidStatusForProductsInOrder(productToOrderIds);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.CLIENT]))
	async addUserToOrder(@Args({ name: "code", type: () => Int }) code: number, @UserGql() user: IUser) {
		return this._ordersService.addUserToOrder(code, user);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAITER, UserRoleEnum.CLIENT])
	)
	async addTableToOrder(@Args("orderId") orderId: string, @Args("tableId") tableId: string) {
		return this._ordersService.addTableToOrder(orderId, tableId);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAITER, UserRoleEnum.HOSTESS])
	)
	async approveOrder(@Args("orderId") orderId: string) {
		return this._ordersService.approveOrder(orderId);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAITER, UserRoleEnum.HOSTESS])
	)
	async rejectOrder(@Args("orderId") orderId: string) {
		return this._ordersService.rejectOrder(orderId);
	}

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAITER, UserRoleEnum.HOSTESS])
	)
	async removeTableFromOrder(@Args("orderId") orderId: string) {
		return this._ordersService.removeTableFrom(orderId);
	}

	// @Mutation(() => ActiveOrderEntity)
	// @UseGuards(
	// 	GqlJwtGuard,
	// 	RolesGuard([
	// 		UserRoleEnum.ADMIN,
	// 		UserRoleEnum.MANAGER,
	// 		UserRoleEnum.WAITER,
	// 		UserRoleEnum.HOSTESS,
	// 		UserRoleEnum.HOOKAH
	// 	])
	// )
	// async confirmOrder(@Args("orderId") orderId: string, @UserGql() user: IUser) {
	// 	return this._ordersService.confirmOrder(orderId, user);
	// }

	@Mutation(() => ActiveOrderEntity)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.WAITER, UserRoleEnum.CLIENT])
	)
	async confirmProductsToOrders(
		@UserGql() user: IUser,
		@Args("productsToOrders", { type: () => [ConfirmProductToOrderInput] })
		productsToOrders: ConfirmProductToOrderInput[]
	) {
		return this._productToOrderService.confirmProductsToOrders(productsToOrders, user);
	}

	@Mutation(() => String)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async closeOrder(@Args("orderId") orderId: string) {
		return this._ordersService.closeOrder(orderId);
	}

	@Mutation(() => String)
	@UseGuards(
		GqlJwtGuard,
		RolesGuard([
			UserRoleEnum.ADMIN,
			UserRoleEnum.MANAGER,
			UserRoleEnum.WAITER,
			UserRoleEnum.HOSTESS,
			UserRoleEnum.HOOKAH,
			UserRoleEnum.CLIENT
		])
	)
	async cancelOrder(@Args("orderId") orderId: string) {
		return this._ordersService.cancelOrder(orderId);
	}
}

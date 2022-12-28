import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserRoleEnum } from "src/app/shared/enums";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { PaginationArgsDto } from "../../shared/dtos";
import { CreatePaymentSystemInput, UpdatePaymentSystemInput } from "../dtos";
import { PaginatedPaymentSystem, PaymentSystemEntity } from "../entities";
import { PaymentSystemsService } from "../services";

@Resolver(() => PaymentSystemEntity)
export class PaymentSystemsResolver {
	constructor(private readonly _paymentSystemService: PaymentSystemsService) {}

	@Query(() => PaymentSystemEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async paymentSystem(@Args("id", { type: () => String }) id: string) {
		return this._paymentSystemService.getPaymentSystem(id);
	}

	@Query(() => PaginatedPaymentSystem)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async paymentSystems(@Args() args: PaginationArgsDto) {
		return this._paymentSystemService.getPaymentSystems(args);
	}

	@Mutation(() => PaymentSystemEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async createPaymentSystem(@Args("paymentSystem") paymentSystem: CreatePaymentSystemInput) {
		return this._paymentSystemService.creatPaymentSystem(paymentSystem);
	}

	@Mutation(() => PaymentSystemEntity)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async updatePaymentSystem(@Args("paymentSystem") paymentSystem: UpdatePaymentSystemInput) {
		return this._paymentSystemService.updatePaymentSystem(paymentSystem.id, paymentSystem);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN]))
	async deletePaymentSystem(@Args("paymentSystemId") id: string) {
		return this._paymentSystemService.deletePaymentSystem(id);
	}
}

import { Args, Field, Mutation, ObjectType, Resolver } from "@nestjs/graphql";

import { ActiveOrderEntity } from "../../orders/entities";
import { FondyService } from "../services/fondy.service";

@ObjectType()
export class FondyLink {
	@Field(() => String)
	link: string;
}

@Resolver(() => ActiveOrderEntity)
@ObjectType()
export class FondyResolver {
	constructor(private readonly _fondyService: FondyService) {}

	@Mutation(() => FondyLink)
	async createPaymentOrderLink(@Args("productsToOrders", { type: () => [String] }) pTos: string[]) {
		const link = await this._fondyService.createPaymentOrderLink(pTos);
		return {
			link
		};
	}
}

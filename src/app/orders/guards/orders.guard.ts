import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserRoleEnum } from "../../shared/enums";
import { ActiveOrderEntity } from "../entities";

export class OrdersGuard implements CanActivate {
	constructor(@InjectRepository(ActiveOrderEntity) private readonly _orderRepository: Repository<ActiveOrderEntity>) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const request = ctx.getContext().req;
		const { place, id } = request.body.variables;

		if (request.user.role === UserRoleEnum.ADMIN) {
			return true;
		}

		if (id) {
			return this.updateGuard(id, request.user.id);
		}

		return this.createGuard(place, request.user.id);
	}

	async createGuard(place: string, userId) {
		const currOrder = await this._orderRepository.findOne({
			where: {
				place: {
					id: place
				}
			},
			relations: ["place", "place.company", "place.company.owner"]
		});

		return currOrder.place.company.owner.id === userId;
	}

	async updateGuard(orderId: string, userId) {
		const currOrder = await this._orderRepository.findOne({
			where: {
				id: orderId
			},
			relations: ["place", "place.company", "place.company.owner"]
		});

		return currOrder.place.company.owner.id === userId;
	}
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { HistoryOrderEntity } from "../../orders/entities";
import { PlaceEntity, UserToPlaceEntity } from "../../places/entities";
import { UserRoleEnum } from "../../shared/enums";
import type { StatisticType } from "../dto/statistic.dto";

@Injectable()
export class StatisticService {
	constructor(
		@InjectRepository(HistoryOrderEntity) private readonly _historyOrderRepo: Repository<HistoryOrderEntity>,
		@InjectRepository(UserToPlaceEntity) private readonly _uTpOrderRepo: Repository<UserToPlaceEntity>,
		@InjectRepository(PlaceEntity) private readonly _placeRepo: Repository<PlaceEntity>
	) {}

	async calculateStatistic(placeId: string) {
		const orders = await this._historyOrderRepo.find({
			where: {
				place: {
					id: placeId
				}
			},
			relations: ["place"]
		});

		const place = await this._placeRepo.findOne({
			where: {
				id: placeId
			},
			relations: ["halls", "halls.tables"]
		});

		const users = await this._uTpOrderRepo.find({
			where: {
				place: {
					id: placeId
				}
			}
		});

		const employees = users.filter((el) => el.role !== UserRoleEnum.CLIENT).length;
		const guests = users.filter((el) => el.role === UserRoleEnum.CLIENT).length;

		const ordersStatistic = orders.reduce(
			(pre, curr) => ({
				...pre,
				totalAmount: Number.parseFloat(pre.totalAmount.toString()) + Number.parseFloat(curr.totalPrice)
			}),
			{ totalAmount: 0 }
		);

		const result: StatisticType = {
			...ordersStatistic,
			guests,
			employees,
			totalAmount: ordersStatistic.totalAmount.toString(),
			tax: (ordersStatistic.totalAmount * 0.05).toString(),
			halls: place.halls.length,
			tables: place.halls.reduce((pre, curr) => pre + curr.tables.length, 0)
		};

		return result;
	}
}

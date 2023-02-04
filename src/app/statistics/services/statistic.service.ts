import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { HistoryOrderEntity } from "../../orders/entities";
import { PlaceEntity } from "../../places/entities";
import type { StatisticType } from "../dto/statistic.dto";

@Injectable()
export class StatisticService {
	constructor(
		@InjectRepository(HistoryOrderEntity) private readonly _historyOrderRepo: Repository<HistoryOrderEntity>,
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

		const ordersStatistic = orders.reduce(
			(pre, curr) => ({
				...pre,
				guests: pre.guests + curr.users.length,
				totalAmount: pre.totalAmount + curr.totalPrice
			}),
			{ guests: 0, totalAmount: 0 }
		);

		const result: StatisticType = {
			...ordersStatistic,
			employees: 0,
			tax: ordersStatistic.totalAmount * 0.05,
			halls: place.halls.length,
			tables: place.halls.reduce((pre, curr) => pre + curr.tables.length, 0)
		};

		return result;
	}
}

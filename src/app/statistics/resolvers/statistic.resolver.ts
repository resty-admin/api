import { Args, Query, Resolver } from "@nestjs/graphql";

import { StatisticType } from "../dto/statistic.dto";
import { StatisticService } from "../services";

@Resolver(() => StatisticType)
export class StatisticResolver {
	constructor(private readonly _statisticService: StatisticService) {}

	@Query(() => StatisticType)
	async getPlaceStatistic(@Args("placeId") placeId: string) {
		return this._statisticService.calculateStatistic(placeId);
	}
}

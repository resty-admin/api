import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { GqlJwtGuard } from "../../auth";
import { RolesGuard } from "../../shared";
import { UserRoleEnum } from "../../shared/enums";
import { StatisticType } from "../dto/statistic.dto";
import { StatisticService } from "../services";

@Resolver(() => StatisticType)
export class StatisticResolver {
	constructor(private readonly _statisticService: StatisticService) {}

	@Query(() => StatisticType)
	@UseGuards(GqlJwtGuard, RolesGuard([UserRoleEnum.ADMIN, UserRoleEnum.MANAGER]))
	async getPlaceStatistic(@Args("placeId") placeId: string) {
		return this._statisticService.calculateStatistic(placeId);
	}
}

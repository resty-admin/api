import { Module } from "@nestjs/common";

import { OrdersModule } from "../orders/orders.module";
import { PlacesModule } from "../places/places.module";
import { STATISTIC_RESOLVERS } from "./resolvers";
import { STATISTIC_SERVICES } from "./services";

@Module({
	imports: [OrdersModule, PlacesModule],
	providers: [...STATISTIC_RESOLVERS, ...STATISTIC_SERVICES],
	exports: []
})
export class StatisticModule {}

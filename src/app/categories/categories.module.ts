import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrdersModule } from "../orders/orders.module";
import { PlacesModule } from "../places/places.module";
import { CATEGORIES_ENITITES } from "./entities";
import { CATEGORIES_RESOLVERS } from "./resolvers";
import { CATEGORIES_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(CATEGORIES_ENITITES), OrdersModule, PlacesModule],
	providers: [...CATEGORIES_SERVICES, ...CATEGORIES_RESOLVERS],
	exports: [TypeOrmModule]
})
export class CategoriesModule {}

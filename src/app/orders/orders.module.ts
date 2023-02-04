import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PlacesModule } from "../places/places.module";
import { ProductsModule } from "../products/products.module";
import { ShiftsModule } from "../shifts/shifts.module";
import { TablesModule } from "../tables/tables.module";
import { UsersModule } from "../users";
import { ORDERS_ENTITIES } from "./entities";
import { ORDERS_GATEWAYS } from "./gateways";
import { ORDERS_RESOLVERS } from "./resolvers";
import { ORDERS_SERVICES } from "./services";

@Module({
	imports: [
		TypeOrmModule.forFeature(ORDERS_ENTITIES),
		HttpModule,
		ShiftsModule,
		forwardRef(() => TablesModule),
		forwardRef(() => ProductsModule),
		forwardRef(() => PlacesModule),
		forwardRef(() => UsersModule)
	],
	providers: [...ORDERS_SERVICES, ...ORDERS_RESOLVERS, ...ORDERS_GATEWAYS],
	exports: [TypeOrmModule, ...ORDERS_SERVICES]
})
export class OrdersModule {}

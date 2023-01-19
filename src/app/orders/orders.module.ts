import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductsModule } from "../products/products.module";
import { ShiftsModule } from "../shifts/shifts.module";
import { TablesModule } from "../tables/tables.module";
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
		forwardRef(() => ProductsModule)
	],
	providers: [...ORDERS_SERVICES, ...ORDERS_RESOLVERS, ...ORDERS_GATEWAYS],
	exports: [TypeOrmModule]
})
export class OrdersModule {}

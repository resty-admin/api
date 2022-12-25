import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ORDERS_CONTROLLERS } from "./controllers";
import { ORDERS_ENTITIES } from "./entities";
import { ORDERS_GATEWAYS } from "./gateways";
import { ORDERS_RESOLVERS } from "./resolvers";
import { ORDERS_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(ORDERS_ENTITIES), HttpModule],
	controllers: ORDERS_CONTROLLERS,
	providers: [...ORDERS_SERVICES, ...ORDERS_RESOLVERS, ...ORDERS_GATEWAYS],
	exports: [TypeOrmModule]
})
export class OrdersModule {}

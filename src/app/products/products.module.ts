import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrdersModule } from "../orders/orders.module";
import { PRODUCTS_CONTROLLERS } from "./controllers";
import { PRODUCTS_ENTITIES } from "./entities";
import { PRODUCTS_RESOLVERS } from "./resolvers";
import { PRODUCTS_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(PRODUCTS_ENTITIES), HttpModule, OrdersModule],
	controllers: PRODUCTS_CONTROLLERS,
	providers: [...PRODUCTS_SERVICES, ...PRODUCTS_RESOLVERS],
	exports: [TypeOrmModule]
})
export class ProductsModule {}

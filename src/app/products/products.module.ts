import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CategoriesModule } from "../categories/categories.module";
import { OrdersModule } from "../orders/orders.module";
import { PRODUCTS_ENTITIES } from "./entities";
import { PRODUCTS_RESOLVERS } from "./resolvers";
import { PRODUCTS_SERVICES } from "./services";

@Module({
	imports: [
		TypeOrmModule.forFeature(PRODUCTS_ENTITIES),
		HttpModule,
		forwardRef(() => CategoriesModule),
		forwardRef(() => OrdersModule)
	],
	providers: [...PRODUCTS_SERVICES, ...PRODUCTS_RESOLVERS],
	exports: [TypeOrmModule, ...PRODUCTS_SERVICES]
})
export class ProductsModule {}

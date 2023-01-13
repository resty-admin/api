import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrdersModule } from "../orders/orders.module";
import { TABLES_CONTROLLERS } from "./controllers";
import { TABLES_ENTITIES } from "./entities";
import { TABLES_RESOLVERS } from "./resolvers";
import { TABLES_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(TABLES_ENTITIES), forwardRef(() => OrdersModule)],
	controllers: TABLES_CONTROLLERS,
	providers: [...TABLES_SERVICES, ...TABLES_RESOLVERS],
	exports: [TypeOrmModule, ...TABLES_SERVICES]
})
export class TablesModule {}

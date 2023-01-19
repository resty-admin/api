import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { HallsModule } from "../halls/halls.module";
import { OrdersModule } from "../orders/orders.module";
import { TABLES_ENTITIES } from "./entities";
import { TABLES_RESOLVERS } from "./resolvers";
import { TABLES_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(TABLES_ENTITIES), forwardRef(() => OrdersModule), forwardRef(() => HallsModule)],
	providers: [...TABLES_SERVICES, ...TABLES_RESOLVERS],
	exports: [TypeOrmModule, ...TABLES_SERVICES]
})
export class TablesModule {}

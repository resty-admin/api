import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrdersModule } from "../orders/orders.module";
import { TablesModule } from "../tables/tables.module";
import { SHIFTS_ENITITES } from "./entities";
import { SHIFTS_RESOLVERS } from "./resolvers";
import { SHIFTS_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(SHIFTS_ENITITES), TablesModule, forwardRef(() => OrdersModule)],
	providers: [...SHIFTS_SERVICES, ...SHIFTS_RESOLVERS],
	exports: [TypeOrmModule]
})
export class ShiftsModule {}

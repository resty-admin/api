import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrdersModule } from "../orders/orders.module";
import { HALLS_CONTROLLERS } from "./controllers";
import { HALLS_ENTITIES } from "./entities";
import { HALLS_RESOLVERS } from "./resolvers";
import { HALLS_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(HALLS_ENTITIES), OrdersModule],
	controllers: HALLS_CONTROLLERS,
	providers: [...HALLS_SERVICES, ...HALLS_RESOLVERS],
	exports: [TypeOrmModule]
})
export class HallsModule {}

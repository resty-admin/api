import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GatewaysModule } from "../gateways/gateways.module";
import { OrdersModule } from "../orders/orders.module";
import { PlacesModule } from "../places/places.module";
import { ShiftsModule } from "../shifts/shifts.module";
import { TablesModule } from "../tables/tables.module";
import { COMMANDS_ENITITES } from "./entities";
import { COMMANDS_RESOLVERS } from "./resolvers";
import { COMMANDS_SERVICES } from "./services";

@Module({
	imports: [
		TypeOrmModule.forFeature(COMMANDS_ENITITES),
		HttpModule,
		TablesModule,
		GatewaysModule,
		OrdersModule,
		ShiftsModule,
		PlacesModule
	],
	providers: [...COMMANDS_SERVICES, ...COMMANDS_RESOLVERS],
	exports: [TypeOrmModule]
})
export class CommandsModule {}

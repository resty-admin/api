import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GatewaysModule } from "../gateways/gateways.module";
import { TablesModule } from "../tables/tables.module";
import { COMMANDS_CONTROLLERS } from "./controllers";
import { COMMANDS_ENITITES } from "./entities";
import { COMMANDS_RESOLVERS } from "./resolvers";
import { COMMANDS_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(COMMANDS_ENITITES), HttpModule, TablesModule, GatewaysModule],
	controllers: COMMANDS_CONTROLLERS,
	providers: [...COMMANDS_SERVICES, ...COMMANDS_RESOLVERS],
	exports: [TypeOrmModule]
})
export class CommandsModule {}

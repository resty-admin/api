import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ACCOUNTING_SYSTEMS_CONTROLLERS } from "./controllers";
import { ACCOUNTING_SYSTEMS_ENTITIES } from "./entities";
import { ACCOUNTING_SYSTEMS_RESOLVERS } from "./resolvers";
import { ACCOUNTING_SYSTEMS_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(ACCOUNTING_SYSTEMS_ENTITIES), HttpModule],
	controllers: ACCOUNTING_SYSTEMS_CONTROLLERS,
	providers: [...ACCOUNTING_SYSTEMS_SERVICES, ...ACCOUNTING_SYSTEMS_RESOLVERS],
	exports: [TypeOrmModule]
})
export class AccountingSystemsModule {}

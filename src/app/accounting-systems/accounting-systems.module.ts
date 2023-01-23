import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ACCOUNTING_SYSTEMS_ENTITIES } from "./entities";
import { PosterModule } from "./poster/poster.module";
import { ACCOUNTING_SYSTEMS_RESOLVERS } from "./resolvers";
import { ACCOUNTING_SYSTEMS_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(ACCOUNTING_SYSTEMS_ENTITIES), HttpModule, PosterModule],
	providers: [...ACCOUNTING_SYSTEMS_SERVICES, ...ACCOUNTING_SYSTEMS_RESOLVERS],
	exports: [TypeOrmModule]
})
export class AccountingSystemsModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { COMPANIES_CONTROLLERS } from "./controllers";
import { COMPANIES_ENTITIES } from "./entities";
import { COMPANIES_RESOLVERS } from "./resolvers";
import { COMPANIES_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(COMPANIES_ENTITIES)],
	controllers: COMPANIES_CONTROLLERS,
	providers: [...COMPANIES_SERVICES, ...COMPANIES_RESOLVERS],
	exports: [TypeOrmModule, ...COMPANIES_SERVICES]
})
export class CompaniesModule {}

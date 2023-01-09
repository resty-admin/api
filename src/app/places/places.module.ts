import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CompaniesModule } from "../companies/companies.module";
import { UsersModule } from "../users";
import { PLACES_CONTROLLERS } from "./controllers";
import { PLACES_ENTITIES } from "./entities";
import { PLACES_RESOLVERS } from "./resolvers";
import { PLACES_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(PLACES_ENTITIES), CompaniesModule, UsersModule],
	controllers: PLACES_CONTROLLERS,
	providers: [...PLACES_SERVICES, ...PLACES_RESOLVERS],
	exports: [TypeOrmModule, ...PLACES_SERVICES]
})
export class PlacesModule {}

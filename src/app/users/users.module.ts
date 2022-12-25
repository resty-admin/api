import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { USERS_CONTROLLERS } from "./controllers";
import { USERS_ENITITES } from "./entities";
import { USERS_RESOLVERS } from "./resolvers";
import { USERS_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(USERS_ENITITES)],
	controllers: USERS_CONTROLLERS,
	providers: [...USERS_SERVICES, ...USERS_RESOLVERS],
	exports: [...USERS_SERVICES, TypeOrmModule]
})
export class UsersModule {}

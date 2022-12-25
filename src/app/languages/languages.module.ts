import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LANGUAGES_CONTROLLERS } from "./controllers";
import { LANGUAGES_ENTITIES } from "./entities";
import { LANGUAGES_RESOLVERS } from "./resolvers";
import { LANGUAGES_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(LANGUAGES_ENTITIES)],
	controllers: LANGUAGES_CONTROLLERS,
	providers: [...LANGUAGES_SERVICES, ...LANGUAGES_RESOLVERS],
	exports: [TypeOrmModule]
})
export class LanguagesModule {}

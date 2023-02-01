import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { I18nModule } from "../shared/i18n/i18n.module";
import { LANGUAGES_CONTROLLERS } from "./controllers";
import { LANGUAGES_ENTITIES } from "./entities";
import { LANGUAGES_RESOLVERS } from "./resolvers";
import { LANGUAGES_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(LANGUAGES_ENTITIES), I18nModule],
	controllers: LANGUAGES_CONTROLLERS,
	providers: [...LANGUAGES_SERVICES, ...LANGUAGES_RESOLVERS],
	exports: [TypeOrmModule]
})
export class LanguagesModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CATEGORIES_CONTROLLERS } from "./controllers";
import { CATEGORIES_ENITITES } from "./entities";
import { CATEGORIES_RESOLVERS } from "./resolvers";
import { CATEGORIES_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(CATEGORIES_ENITITES)],
	controllers: CATEGORIES_CONTROLLERS,
	providers: [...CATEGORIES_SERVICES, ...CATEGORIES_RESOLVERS],
	exports: [TypeOrmModule]
})
export class CategoriesModule {}

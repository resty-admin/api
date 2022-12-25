import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ATTRIBUTES_CONTROLLERS } from "./controllers";
import { ATTRIBUTES_ENTITIES } from "./entities";
import { ATTRIBUTES_RESOLVERS } from "./resolvers";
import { ATTRIBUTES_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(ATTRIBUTES_ENTITIES), HttpModule],
	controllers: ATTRIBUTES_CONTROLLERS,
	providers: [...ATTRIBUTES_SERVICES, ...ATTRIBUTES_RESOLVERS],
	exports: [TypeOrmModule]
})
export class AttributesModule {}

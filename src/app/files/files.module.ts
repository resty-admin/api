import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CompaniesModule } from "../companies/companies.module";
import { PlacesModule } from "../places/places.module";
import { SpacesModule } from "../shared/spaces";
import { FILES_CONTROLLERS } from "./controllers";
import { FILES_ENTITIES } from "./entities";
import { FILES_PROVIDERS } from "./providers";
import { FILES_SERVICES } from "./services";

@Module({
	controllers: FILES_CONTROLLERS,
	imports: [
		TypeOrmModule.forFeature(FILES_ENTITIES),
		MulterModule.register(),
		HttpModule,
		SpacesModule,
		CompaniesModule,
		PlacesModule
	],
	providers: [...FILES_SERVICES, ...FILES_PROVIDERS],
	exports: FILES_SERVICES
})
export class FilesModule {}

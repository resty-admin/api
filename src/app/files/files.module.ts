import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FILES_CONTROLLERS } from "./controllers";
import { FILES_ENTITIES } from "./entities";
import { FILES_PROVIDERS } from "./providers";
import { FILES_SERVICES } from "./services";

@Module({
	controllers: FILES_CONTROLLERS,
	imports: [TypeOrmModule.forFeature(FILES_ENTITIES), MulterModule.register()],
	providers: [...FILES_SERVICES, ...FILES_PROVIDERS],
	exports: FILES_SERVICES
})
export class FilesModule {}

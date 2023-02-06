import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as requestIp from "request-ip";

import { AppModule } from "./app/app.module";
import { initGraphql } from "./app/core/graphql";
import { swagger } from "./app/core/swagger";
import { environment } from "./environments/environment";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
			// , whitelist: true
		})
	);

	app.setGlobalPrefix("api");
	app.use(requestIp.mw());

	swagger(app);
	initGraphql();

	app.enableCors();

	await app.listen(environment.port);

	Logger.log(`🚀 Application is running on: http://172.30.8.211:${environment.port}/api`, "Bootstrap");
	Logger.log(`🚀 Swagger is running on: http://172.30.8.211:${environment.port}/api/swagger`, "Bootstrap");
	Logger.log(`🚀 Graphql playground is running on: http://172.30.8.211:${environment.port}/graphql`, "Bootstrap");
}

bootstrap().then();

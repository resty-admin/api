// require('dotenv').config();
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
	// app.use(stHttpLoggerMiddleware);
	// stLogger.info("Hello World.");
	// stLogger.debug("Hello debug.");
	// stLogger.warn("Some warning.");
	// stLogger.error("Some error.");

	swagger(app);
	initGraphql();

	app.enableCors();

	await app.listen(environment.port);

	console.log("HELLO");
	console.error("HELLO ERROR");
	Logger.log(`🚀 Application  is running on: http://192.168.68.101:${environment.port}/api`, "Bootstrap");
	Logger.log(`🚀 Swagger is running on: http://192.168.68.101:${environment.port}/api/swagger`, "Bootstrap");
	Logger.log(`🚀 Graphql playground is running on: http://192.168.68.101:${environment.port}/graphql`, "Bootstrap");
}

bootstrap().then();

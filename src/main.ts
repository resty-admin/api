require("dotenv").config();
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as requestIp from "request-ip";

// import { stHttpLoggerMiddleware } from "sematext-agent-express";
import { AppModule } from "./app/app.module";
import { initGraphql } from "./app/core/graphql";
import { swagger } from "./app/core/swagger";
import { environment } from "./environments/environment";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	);

	app.setGlobalPrefix("api");
	app.use(requestIp.mw());
	// app.use(stHttpLoggerMiddleware);

	swagger(app);
	initGraphql();

	app.enableCors();

	console.log("SUPER NEW UPDATE");

	await app.listen(environment.port);

	Logger.log(`🚀 Application  is running on: http://192.168.68.105:${environment.port}/api`, "Bootstrap");
	Logger.log(`🚀 Swagger is running on: http://192.168.68.105:${environment.port}/api/swagger`, "Bootstrap");
	Logger.log(`🚀 Graphql playground is running on: http://192.168.68.105:${environment.port}/graphql`, "Bootstrap");
}

bootstrap().then();

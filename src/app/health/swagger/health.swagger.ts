import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { HealthModule } from "../health.module";

export function healthSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Health").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [HealthModule]
	});
	SwaggerModule.setup("api/swagger/health", app, document);
}

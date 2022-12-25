import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AuthModule } from "../auth.module";

export function authSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Auth").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [AuthModule]
	});
	SwaggerModule.setup("api/swagger/auth", app, document);
}

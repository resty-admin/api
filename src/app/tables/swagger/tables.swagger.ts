import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { TablesModule } from "../tables.module";

export function tablesSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Tables").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [TablesModule]
	});
	SwaggerModule.setup("api/swagger/tables", app, document);
}

import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { LanguagesModule } from "../languages.module";

export function languagesSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Languages").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [LanguagesModule]
	});
	SwaggerModule.setup("api/swagger/languages", app, document);
}

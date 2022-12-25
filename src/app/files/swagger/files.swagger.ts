import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { FilesModule } from "../files.module";

export function filesSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Files").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [FilesModule]
	});
	SwaggerModule.setup("api/swagger/files", app, document);
}

import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { HallsModule } from "../halls.module";

export function hallsSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Halls").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [HallsModule]
	});
	SwaggerModule.setup("api/swagger/halls", app, document);
}

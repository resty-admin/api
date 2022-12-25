import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { PlacesModule } from "../places.module";

export function placesSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Places").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [PlacesModule]
	});
	SwaggerModule.setup("api/swagger/places", app, document);
}

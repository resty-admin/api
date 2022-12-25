import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AttributesModule } from "../attributes.module";

export function attributesSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Attribute").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [AttributesModule]
	});
	SwaggerModule.setup("api/swagger/attributes", app, document);
}

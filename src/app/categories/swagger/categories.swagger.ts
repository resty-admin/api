import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { CategoriesModule } from "../categories.module";

export function categoriesSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Categories").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [CategoriesModule]
	});
	SwaggerModule.setup("api/swagger/categories", app, document);
}

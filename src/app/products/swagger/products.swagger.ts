import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { ProductsModule } from "../products.module";

export function productsSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Products").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [ProductsModule]
	});
	SwaggerModule.setup("api/swagger/products", app, document);
}

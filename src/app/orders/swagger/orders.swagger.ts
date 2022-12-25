import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { OrdersModule } from "../orders.module";

export function ordersSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Orders").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [OrdersModule]
	});
	SwaggerModule.setup("api/swagger/orders", app, document);
}

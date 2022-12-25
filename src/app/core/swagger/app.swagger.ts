import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function appSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Resty").addBearerAuth().build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/swagger", app, document);
}

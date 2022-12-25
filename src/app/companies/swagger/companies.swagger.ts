import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { CompaniesModule } from "../companies.module";

export function companiesSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Companies").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [CompaniesModule]
	});
	SwaggerModule.setup("api/swagger/companies", app, document);
}

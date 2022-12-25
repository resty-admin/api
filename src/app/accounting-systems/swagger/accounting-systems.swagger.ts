import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AccountingSystemsModule } from "../accounting-systems.module";

export function accountingSystemsSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Accounting Systems").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [AccountingSystemsModule]
	});
	SwaggerModule.setup("api/swagger/accounting-systems", app, document);
}

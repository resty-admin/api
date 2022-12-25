import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { ShiftsModule } from "../shifts.module";

export function shiftsSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Shifts").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [ShiftsModule]
	});
	SwaggerModule.setup("api/swagger/shifts", app, document);
}

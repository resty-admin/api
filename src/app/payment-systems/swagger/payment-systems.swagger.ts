import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { PaymentSystemsModule } from "../payment-systems.module";

export function paymentSystemsSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Payment Systems").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [PaymentSystemsModule]
	});
	SwaggerModule.setup("api/swagger/payment-systems", app, document);
}

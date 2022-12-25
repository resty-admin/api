import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { UsersModule } from "../users.module";

export function usersSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Users").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [UsersModule]
	});
	SwaggerModule.setup("api/swagger/users", app, document);
}

import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { CommandsModule } from "../commands.module";

export function commandsSwagger(app: INestApplication) {
	const config = new DocumentBuilder().setTitle("Commands").build();
	const document = SwaggerModule.createDocument(app, config, {
		include: [CommandsModule]
	});
	SwaggerModule.setup("api/swagger/commands", app, document);
}

import type { INestApplication } from "@nestjs/common";

import { authSwagger } from "../../auth/swagger";
import { filesSwagger } from "../../files/swagger";
import { healthSwagger } from "../../health/swagger";
import { languagesSwagger } from "../../languages/swagger";
import { usersSwagger } from "../../users/swagger";
import { appSwagger } from "./app.swagger";

export function swagger(app: INestApplication) {
	appSwagger(app);
	authSwagger(app);
	usersSwagger(app);
	filesSwagger(app);
	healthSwagger(app);
	languagesSwagger(app);
}

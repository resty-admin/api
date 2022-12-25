import type { INestApplication } from "@nestjs/common";

import { accountingSystemsSwagger } from "../../accounting-systems/swagger";
import { attributesSwagger } from "../../attributes/swagger";
import { authSwagger } from "../../auth/swagger";
import { categoriesSwagger } from "../../categories/swagger";
import { commandsSwagger } from "../../commands/swagger";
import { companiesSwagger } from "../../companies/swagger";
import { filesSwagger } from "../../files/swagger";
import { hallsSwagger } from "../../halls/swagger";
import { healthSwagger } from "../../health/swagger";
import { languagesSwagger } from "../../languages/swagger";
import { ordersSwagger } from "../../orders/swagger";
import { paymentSystemsSwagger } from "../../payment-systems/swagger";
import { placesSwagger } from "../../places/swagger";
import { productsSwagger } from "../../products/swagger";
import { shiftsSwagger } from "../../shifts/swagger";
import { tablesSwagger } from "../../tables/swagger";
import { usersSwagger } from "../../users/swagger";
import { appSwagger } from "./app.swagger";

export function swagger(app: INestApplication) {
	appSwagger(app);
	authSwagger(app);
	usersSwagger(app);
	filesSwagger(app);
	commandsSwagger(app);
	categoriesSwagger(app);
	companiesSwagger(app);
	placesSwagger(app);
	healthSwagger(app);
	hallsSwagger(app);
	tablesSwagger(app);
	productsSwagger(app);
	ordersSwagger(app);
	languagesSwagger(app);
	paymentSystemsSwagger(app);
	accountingSystemsSwagger(app);
	attributesSwagger(app);
	shiftsSwagger(app);
}

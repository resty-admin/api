import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as fs from "fs";

import { environment } from "../../../environments/environment";
import { ACCOUNTING_SYSTEMS_ENTITIES } from "../../accounting-systems/entities";
import { ATTRIBUTES_ENTITIES } from "../../attributes/entities";
import { CATEGORIES_ENITITES } from "../../categories/entities";
import { COMMANDS_ENITITES } from "../../commands/entities";
import { COMPANIES_ENTITIES } from "../../companies/entities";
import { FILES_ENTITIES } from "../../files/entities";
import { HALLS_ENTITIES } from "../../halls/entities";
import { LANGUAGES_ENTITIES } from "../../languages/entities";
import { ORDERS_ENTITIES } from "../../orders/entities";
import { PAYMENT_SYSTEMS_ENTITIES } from "../../payment-systems/entities";
import { PLACES_ENTITIES } from "../../places/entities";
import { PRODUCTS_ENTITIES } from "../../products/entities";
import { SHIFTS_ENITITES } from "../../shifts/entities";
import { TABLES_ENTITIES } from "../../tables/entities";
import { USERS_ENITITES } from "../../users/entities";

export const TYPEORM_CONFIG: TypeOrmModuleOptions = {
	type: "postgres",
	host: environment.databaseHost,
	port: environment.databasePort,
	username: environment.databaseUsername,
	password: environment.databasePassword,
	database: environment.databaseName,
	entities: [
		...USERS_ENITITES,
		...FILES_ENTITIES,
		...COMMANDS_ENITITES,
		...CATEGORIES_ENITITES,
		...COMPANIES_ENTITIES,
		...PLACES_ENTITIES,
		...HALLS_ENTITIES,
		...TABLES_ENTITIES,
		...PRODUCTS_ENTITIES,
		...ORDERS_ENTITIES,
		...LANGUAGES_ENTITIES,
		...PAYMENT_SYSTEMS_ENTITIES,
		...ACCOUNTING_SYSTEMS_ENTITIES,
		...ATTRIBUTES_ENTITIES,
		...SHIFTS_ENITITES
	],
	synchronize: true,
	migrations: [],
	migrationsRun: false,
	// environment.production,
	...(environment.production
		? {
				ssl: {
					ca: fs.readFileSync("ca-certificate.crt")
				}
		  }
		: {})
};

// export default new DataSource({
// 	...TYPEORM_CONFIG,
// 	entities: ["apps/nest/api/src/app/**/entities/index.ts"]
// });

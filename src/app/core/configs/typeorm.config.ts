import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as fs from "fs";
import { DataSource } from "typeorm";

import { environment } from "../../../environments/environment";
import { Admin1675617506058 } from "../../../migrations/1675617506058-admin";
import { FondyPaymentSystem1675677687530 } from "../../../migrations/1675677687530-fondy";
import { InitDb1677448816647 } from "../../../migrations/1677448816647-migration_name";
import { OrderNumber1677538266844 } from "../../../migrations/1677538266844-migration_name";
import { UpdateOrderNumber1677609137157 } from "../../../migrations/1677609137157-migration_name";
import { historyOrderDate1678048152060 } from "../../../migrations/1678048152060-migration_name";
import { AccSysOrderEnum1678365196872 } from "../../../migrations/1678365196872-acc-sys_order-enum";
import { OrderNumberNull1678366744741 } from "../../../migrations/1678366744741-migration_name";
import { OrderTypeUpdate1678374700679 } from "../../../migrations/1678374700679-order_type";
import { PriceString1678390766339 } from "../../../migrations/1678390766339-price";
import { migrationName1678391284340 } from "../../../migrations/1678391284340-migration_name";
import { AttrGroupPoster1678469961942 } from "../../../migrations/1678469961942-migration_name";
import { migrationName1678470981260 } from "../../../migrations/1678470981260-migration_name";
import { migrationName1678471701103 } from "../../../migrations/1678471701103-migration_name";
import { migrationName1678795456515 } from "../../../migrations/1678795456515-migration_name";
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
	type: "postgres" as any,
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
	synchronize: !environment.production,
	migrationsTableName: "resty-api-migrations",
	// migrations: [InitDb1677448816647, Admin1675617506058, FondyPaymentSystem1675677687530, PosterAccountSystem1675677996962],
	migrations: [
		InitDb1677448816647,
		Admin1675617506058,
		OrderNumber1677538266844,
		UpdateOrderNumber1677609137157,
		historyOrderDate1678048152060,
		FondyPaymentSystem1675677687530,
		AccSysOrderEnum1678365196872,
		OrderNumberNull1678366744741,
		OrderTypeUpdate1678374700679,
		PriceString1678390766339,
		migrationName1678391284340,
		AttrGroupPoster1678469961942,
		migrationName1678470981260,
		migrationName1678471701103,
		migrationName1678795456515
	],
	migrationsRun: environment.production,
	...(environment.production
		? {
				ssl: {
					ca: fs.readFileSync("ca-certificate.crt")
				}
		  }
		: {})
};

export default new DataSource({
	...TYPEORM_CONFIG,
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
	]
} as any);

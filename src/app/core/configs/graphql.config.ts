import { ApolloDriver } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import { AccountingSystemsModule } from "../../accounting-systems/accounting-systems.module";
import { AttributesModule } from "../../attributes/attributes.module";
import { CategoriesModule } from "../../categories/categories.module";
import { CommandsModule } from "../../commands/commands.module";
import { CompaniesModule } from "../../companies/companies.module";
import { FilesModule } from "../../files/files.module";
import { HallsModule } from "../../halls/halls.module";
import { HealthModule } from "../../health/health.module";
import { LanguagesModule } from "../../languages/languages.module";
import { OrdersModule } from "../../orders/orders.module";
import { PaymentSystemsModule } from "../../payment-systems/payment-systems.module";
import { PlacesModule } from "../../places/places.module";
import { ProductsModule } from "../../products/products.module";
import { ShiftsModule } from "../../shifts/shifts.module";
import { TablesModule } from "../../tables/tables.module";
import { UsersModule } from "../../users";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path");

export const GRAPHQL_CONFIG = {
	autoSchemaFile: join(process.cwd(), "apps/nest/api/src/schema.gql"),
	include: [
		UsersModule,
		FilesModule,
		CommandsModule,
		CategoriesModule,
		CompaniesModule,
		PlacesModule,
		HealthModule,
		HallsModule,
		TablesModule,
		ProductsModule,
		OrdersModule,
		LanguagesModule,
		PaymentSystemsModule,
		AccountingSystemsModule,
		AttributesModule,
		ShiftsModule
	],
	context: ({ req }) => ({ req }),
	driver: ApolloDriver,
	playground: false,
	plugins: [ApolloServerPluginLandingPageLocalDefault()]
};

import { ApolloDriver } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import type { GraphQLError, GraphQLFormattedError } from "graphql/error";

import { AccountingSystemsModule } from "../../accounting-systems/accounting-systems.module";
import { AttributesModule } from "../../attributes/attributes.module";
import { AuthModule } from "../../auth";
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
import { StatisticModule } from "../../statistics/statistic.module";
import { TablesModule } from "../../tables/tables.module";
import { UsersModule } from "../../users";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path");

export const GRAPHQL_CONFIG = {
	autoSchemaFile: join(process.cwd(), "schema.gql"),
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
		ShiftsModule,
		AuthModule,
		StatisticModule
	],
	context: ({ req }) => ({ req }),
	formatError: (error: GraphQLError) => {
		const validationPipeErrors = (error as any).extensions.response?.message;
		const graphqlError = (error as any).extensions.exception?.message;
		const graphQLFormattedError: GraphQLFormattedError = {
			extensions: {
				codes: [...(validationPipeErrors || []), graphqlError].filter((el) => el) as any
			},
			message: error.message
		};
		return graphQLFormattedError;
	},
	driver: ApolloDriver,
	playground: false,
	plugins: [ApolloServerPluginLandingPageLocalDefault()]
};

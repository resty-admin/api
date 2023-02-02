import type { ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccountingSystemsModule } from "../accounting-systems/accounting-systems.module";
import { AttributesModule } from "../attributes/attributes.module";
import { AuthModule } from "../auth";
import { CategoriesModule } from "../categories/categories.module";
import { CommandsModule } from "../commands/commands.module";
import { CompaniesModule } from "../companies/companies.module";
import { CronsModule } from "../crons/crons.module";
import { FilesModule } from "../files/files.module";
import { HallsModule } from "../halls/halls.module";
import { HealthModule } from "../health/health.module";
import { LanguagesModule } from "../languages/languages.module";
import { OrdersModule } from "../orders/orders.module";
import { PaymentSystemsModule } from "../payment-systems/payment-systems.module";
import { PlacesModule } from "../places/places.module";
import { ProductsModule } from "../products/products.module";
import { ApiModule } from "../shared/api";
import { CryptoModule } from "../shared/crypto";
import { I18nModule } from "../shared/i18n/i18n.module";
import { ShiftsModule } from "../shifts/shifts.module";
import { StatisticModule } from "../statistics/statistic.module";
import { TablesModule } from "../tables/tables.module";
import { UsersModule } from "../users";
import { API_CONFIG, CRYPTO_CONFIG, GRAPHQL_CONFIG, TYPEORM_CONFIG } from "./configs";
import { CORE_FILTERS } from "./filters";
import { CORE_INTERCEPTORS } from "./interceptors";

@Module({
	imports: [
		TypeOrmModule.forRoot(TYPEORM_CONFIG),
		GraphQLModule.forRoot<ApolloDriverConfig>(GRAPHQL_CONFIG),
		ApiModule.forRoot(API_CONFIG),
		CryptoModule.forRoot(CRYPTO_CONFIG),
		UsersModule,
		FilesModule,
		CommandsModule,
		CategoriesModule,
		CompaniesModule,
		PlacesModule,
		HealthModule,
		AuthModule,
		HallsModule,
		TablesModule,
		ProductsModule,
		OrdersModule,
		LanguagesModule,
		CronsModule,
		PaymentSystemsModule,
		AccountingSystemsModule,
		AttributesModule,
		ShiftsModule,
		StatisticModule,
		I18nModule
	],
	providers: [...CORE_INTERCEPTORS, ...CORE_FILTERS]
})
export class CoreModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CompaniesModule } from "../companies/companies.module";
import { OrdersModule } from "../orders/orders.module";
import { ApiModule } from "../shared/api";
import { CryptoModule } from "../shared/crypto";
import { PAYMENT_SYSTEMS_CONTROLLERS } from "./controllers";
import { PAYMENT_SYSTEMS_ENTITIES } from "./entities";
import { PAYMENT_SYSTEMS_RESOLVERS } from "./resolvers";
import { PAYMENT_SYSTEMS_SERVICES } from "./services";

@Module({
	imports: [
		TypeOrmModule.forFeature(PAYMENT_SYSTEMS_ENTITIES),
		CompaniesModule,
		OrdersModule,
		ApiModule.forChild(),
		CryptoModule.forChild()
	],
	controllers: PAYMENT_SYSTEMS_CONTROLLERS,
	providers: [...PAYMENT_SYSTEMS_SERVICES, ...PAYMENT_SYSTEMS_RESOLVERS],
	exports: [TypeOrmModule]
})
export class PaymentSystemsModule {}

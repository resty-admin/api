import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";

import { CategoriesModule } from "../../categories/categories.module";
import { HallsModule } from "../../halls/halls.module";
import { ProductsModule } from "../../products/products.module";
import { TablesModule } from "../../tables/tables.module";
import { AccountingSystemsModule } from "../accounting-systems.module";
import { POSTER_RESOLVERS } from "./resolvers";
import { POSTER_SERVICES } from "./services";

@Module({
	imports: [
		HttpModule,
		forwardRef(() => AccountingSystemsModule),
		forwardRef(() => HallsModule),
		forwardRef(() => TablesModule),
		forwardRef(() => CategoriesModule),
		forwardRef(() => ProductsModule)
	],
	providers: [...POSTER_SERVICES, ...POSTER_RESOLVERS],
	exports: []
})
export class PosterModule {}

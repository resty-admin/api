import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";

import { AttributesModule } from "../../attributes/attributes.module";
import { CategoriesModule } from "../../categories/categories.module";
import { FilesModule } from "../../files/files.module";
import { HallsModule } from "../../halls/halls.module";
import { OrdersModule } from "../../orders/orders.module";
import { PlacesModule } from "../../places/places.module";
import { ProductsModule } from "../../products/products.module";
import { TablesModule } from "../../tables/tables.module";
import { AccountingSystemsModule } from "../accounting-systems.module";
import { POSTER_CONTROLLERS } from "./controller";
import { POSTER_RESOLVERS } from "./resolvers";
import { POSTER_SERVICES } from "./services";

@Module({
	controllers: POSTER_CONTROLLERS,
	imports: [
		HttpModule,
		forwardRef(() => AccountingSystemsModule),
		forwardRef(() => HallsModule),
		forwardRef(() => TablesModule),
		forwardRef(() => CategoriesModule),
		forwardRef(() => ProductsModule),
		forwardRef(() => OrdersModule),
		forwardRef(() => FilesModule),
		forwardRef(() => AttributesModule),
		forwardRef(() => PlacesModule)
	],
	providers: [...POSTER_SERVICES, ...POSTER_RESOLVERS],
	exports: []
})
export class PosterModule {}

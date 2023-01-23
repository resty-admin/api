import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";

import { HallsModule } from "../../halls/halls.module";
import { AccountingSystemsModule } from "../accounting-systems.module";
import { POSTER_RESOLVERS } from "./resolvers";
import { POSTER_SERVICES } from "./services";

@Module({
	imports: [HttpModule, forwardRef(() => AccountingSystemsModule), forwardRef(() => HallsModule)],
	providers: [...POSTER_SERVICES, ...POSTER_RESOLVERS],
	exports: []
})
export class PosterModule {}

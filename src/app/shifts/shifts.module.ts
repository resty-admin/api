import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SHIFTS_CONTROLLERS } from "./controllers";
import { SHIFTS_ENITITES } from "./entities";
import { SHIFTS_RESOLVERS } from "./resolvers";
import { SHIFTS_SERVICES } from "./services";

@Module({
	imports: [TypeOrmModule.forFeature(SHIFTS_ENITITES)],
	controllers: SHIFTS_CONTROLLERS,
	providers: [...SHIFTS_SERVICES, ...SHIFTS_RESOLVERS],
	exports: [TypeOrmModule]
})
export class ShiftsModule {}

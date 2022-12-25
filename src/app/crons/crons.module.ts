import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { PlacesModule } from "../places/places.module";
import { ShiftsModule } from "../shifts/shifts.module";
import { CRONS_SERVICES } from "./services";

@Module({
	imports: [ScheduleModule.forRoot(), PlacesModule, ShiftsModule],
	providers: CRONS_SERVICES
})
export class CronsModule {}

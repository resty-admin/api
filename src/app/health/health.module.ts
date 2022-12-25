import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HEALTH_CONTROLLERS } from "./controllers";

@Module({
	imports: [TerminusModule, HttpModule],
	controllers: HEALTH_CONTROLLERS
})
export class HealthModule {}

import { Module } from "@nestjs/common";

import { I18N_SERVICES } from "./services";

@Module({
	providers: I18N_SERVICES,
	exports: I18N_SERVICES
})
export class I18nModule {}

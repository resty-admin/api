import { Module } from "@nestjs/common";

import { SpacesModule } from "../spaces";
import { I18N_SERVICES } from "./services";

@Module({
	imports: [SpacesModule],
	providers: I18N_SERVICES,
	exports: I18N_SERVICES
})
export class I18nModule {}

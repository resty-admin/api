import { Module } from "@nestjs/common";

import { SPACES_PROVIDERS } from "./providers";
import { SPACES_SERVICES } from "./services";

@Module({
	imports: [],
	providers: [...SPACES_SERVICES, ...SPACES_PROVIDERS],
	exports: [...SPACES_SERVICES, ...SPACES_PROVIDERS]
})
export class SpacesModule {}

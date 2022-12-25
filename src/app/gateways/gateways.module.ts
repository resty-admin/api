import { Module } from "@nestjs/common";

import { GATEWAYS } from "./gateways";
import { GATEWAYS_SERVICES } from "./services";

@Module({
	providers: [...GATEWAYS, ...GATEWAYS_SERVICES],
	exports: [...GATEWAYS, ...GATEWAYS_SERVICES]
})
export class GatewaysModule {}

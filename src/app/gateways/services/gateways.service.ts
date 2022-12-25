import { Injectable } from "@nestjs/common";

import { Gateways } from "../gateways";

@Injectable()
export class GatewaysService {
	constructor(private readonly _gateways: Gateways) {}

	emitEvent(eventName: string, ...arguments_: unknown[]) {
		this._gateways.emitEvent(eventName, ...arguments_);
	}
}

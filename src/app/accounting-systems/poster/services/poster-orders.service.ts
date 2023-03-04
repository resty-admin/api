import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

import { PosterCoreService } from "./poster-core.service";

@Injectable()
export class PosterOrdersService {
	constructor(private readonly _httpService: HttpService, private readonly _posterCoreService: PosterCoreService) {}

	// async syncOrders(placeId: string) {
	// 	const token = await this._posterCoreService.getToken(placeId);
	// 	// const url = `https://joinposter.com/api/incomingOrders.getIncomingOrders?token=${token}`;
	// }
	//
	// async syncClients(placeId: string) {
	// 	const token = await this._posterCoreService.getToken(placeId);
	// 	const url = `https://joinposter.com/api/clients.getClients?token=${token}`;
	// }
}

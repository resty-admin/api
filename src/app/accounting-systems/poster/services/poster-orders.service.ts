import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

import { PosterCoreService } from "./poster-core.service";

@Injectable()
export class PosterOrdersService {
	constructor(private readonly _httpService: HttpService, private readonly _posterCoreService: PosterCoreService) {}

	async syncOrders(placeId: string) {
		const token = await this._posterCoreService.getToken(placeId);
		// const url = `https://joinposter.com/api/incomingOrders.getIncomingOrders?token=${token}`;

		const url = `https://joinposter.com/api/incomingOrders.getReservations?token=${token}`;

		const { response: posterOrders } = (await this._httpService.get(url).toPromise()).data;

		console.log("response", posterOrders);
	}

	async syncHistoryOrders(placeId: string) {
		const token = await this._posterCoreService.getToken(placeId);
		const url = `https://joinposter.com/api/transactions.getTransactions?token=${token}&date_from=2021-11-30&date_to=2023-03-10`;

		const { response: posterHistoryOrders } = (await this._httpService.get(url).toPromise()).data;

		console.log("response", posterHistoryOrders);
	}

	//
	// async syncClients(placeId: string) {
	// 	const token = await this._posterCoreService.getToken(placeId);
	// 	const url = `https://joinposter.com/api/clients.getClients?token=${token}`;
	// }
}

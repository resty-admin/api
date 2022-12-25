import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { PlacesService } from "../../places/services";

@Injectable()
export class PlacesCronsService {
	constructor(
		@InjectRepository(PlaceEntity) private readonly _placesRepository: Repository<PlaceEntity>,
		private readonly _placesService: PlacesService
	) {}

	// 0 * * * *  - every hour
	@Cron(CronExpression.EVERY_HOUR)
	async handlePlacesStatus() {
		// const places = await this._placesRepository.find();
		// const currentHours = new Date().getHours();
		//
		// for (const place of places) {
		// 	const shouldStatusBeClosed = place.endTime === currentHours;
		// 	const shouldStatusBeOpened = place.startTime === currentHours;
		//
		// 	if (!shouldStatusBeClosed && !shouldStatusBeOpened) {
		// 		return;
		// 	}
		//
		// 	await this._placesService.updatePlace(place.id, {
		// 		...place,
		// 		status: shouldStatusBeOpened ? PlaceStatusEnum.OPENED : PlaceStatusEnum.CLOSED
		// 	});
		// }
	}
}

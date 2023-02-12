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
	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	async handlePlacesStatus() {
		const places = await this._placesRepository.find();

		for (const place of places) {
			const waiterCode = Math.floor(1000 + Math.random() * 9000);
			await this._placesRepository.save({ ...place, waiterCode });
		}
	}
}

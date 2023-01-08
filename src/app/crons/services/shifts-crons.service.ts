import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ActiveShiftEntity } from "../../shifts/entities";
import { HistoryShiftEntity } from "../../shifts/entities/history-shift.entity";

@Injectable()
export class ShiftsCronsService {
	constructor(
		@InjectRepository(ActiveShiftEntity) private readonly _activeShiftsRepository: Repository<ActiveShiftEntity>,
		@InjectRepository(HistoryShiftEntity) private readonly _historyShiftsRepository: Repository<HistoryShiftEntity>
	) {}

	// @Cron(CronExpression.EVERY_DAY_AT_7AM)
	// async handleShiftsLogging() {
	// 	const activeShifts = await this._activeShiftsRepository.find();
	// 	if (activeShifts.length === 0) {
	// 		return;
	// 	}
	//
	// 	await this._historyShiftsRepository.save(activeShifts);
	// 	await this._activeShiftsRepository.delete(activeShifts.map((shift) => shift.id));
	// }
}

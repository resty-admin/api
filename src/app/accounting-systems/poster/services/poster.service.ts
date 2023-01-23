import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { Repository } from "typeorm";

import { HallEntity } from "../../../halls/entities";
import { ErrorsEnum } from "../../../shared/enums";
import { AccountingSystemEntity, PlaceToAccountingSystemEntity } from "../../entities";

@Injectable()
export class PosterService {
	constructor(
		@InjectRepository(PlaceToAccountingSystemEntity) private readonly _pTa: Repository<PlaceToAccountingSystemEntity>,
		@InjectRepository(AccountingSystemEntity) private readonly _accSystem: Repository<AccountingSystemEntity>,
		@InjectRepository(HallEntity) private readonly _hallRepo: Repository<HallEntity>,
		private readonly _httpService: HttpService
	) {}

	async syncHalls(placeId: string) {
		const poster = await this.getPosterAccSystem();
		const placeConfigs = await this._pTa.findOne({
			where: {
				place: {
					id: placeId
				},
				accountingSystem: {
					id: poster.id
				}
			}
		});

		const token = (placeConfigs.placeConfigFields as any).access_token || null;
		if (!token) {
			throw new GraphQLError(ErrorsEnum.PosterTokenNotExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}
		const url = `https://joinposter.com/api/spots.getSpotTablesHalls?token=${token}`;

		const { response: posterHalls } = (await this._httpService.get(url).toPromise()).data;

		const halls = await this._hallRepo.find({
			where: {
				place: {
					id: placeId
				}
			},
			relations: ["place"]
		});

		const existedHalls = halls.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));
		const updatedHalls = existedHalls.map((hall) => {
			const posterHall = posterHalls.find((el) => el.hall_id === hall.accountingSystemsFields["posterId"]);
			return {
				...hall,
				name: posterHall["hall_name"]
			};
		});

		const newHalls = posterHalls
			.filter((pH) => !existedHalls.some((eH) => eH.accountingSystemsFields["posterId"] === pH["hall_id"]))
			.map((nH) => ({
				name: nH["hall_name"],
				place: {
					id: placeId
				},
				accountingSystemsFields: {
					posterId: nH["hall_id"]
				}
			}));

		try {
			await this._hallRepo.save([...updatedHalls, ...newHalls]);
			return "sync done!";
		} catch {
			throw new GraphQLError("jopa", {
				extensions: {
					code: 500
				}
			});
		}
	}

	async getPosterAccSystem() {
		return this._accSystem.findOne({
			where: {
				name: "POSTER"
			}
		});
	}
}

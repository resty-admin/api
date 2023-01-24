import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { Repository } from "typeorm";

import { HallEntity } from "../../../halls/entities";
import { ErrorsEnum } from "../../../shared/enums";
import { TableEntity } from "../../../tables/entities";
import { AccountingSystemEntity, PlaceToAccountingSystemEntity } from "../../entities";

@Injectable()
export class PosterService {
	constructor(
		@InjectRepository(PlaceToAccountingSystemEntity) private readonly _pTa: Repository<PlaceToAccountingSystemEntity>,
		@InjectRepository(AccountingSystemEntity) private readonly _accSystem: Repository<AccountingSystemEntity>,
		@InjectRepository(HallEntity) private readonly _hallRepo: Repository<HallEntity>,
		@InjectRepository(TableEntity) private readonly _tableRepo: Repository<TableEntity>,
		private readonly _httpService: HttpService
	) {}

	async syncHalls(placeId: string) {
		const token = await this.getToken(placeId);
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

	async syncTables(placeId: string) {
		const token = await this.getToken(placeId);
		const url = `https://joinposter.com/api/spots.getTableHallTables?token=${token}`;

		const { response: posterTables } = (await this._httpService.get(url).toPromise()).data;

		const tables = await this._tableRepo.find({
			where: {
				hall: {
					place: {
						id: placeId
					}
				}
			},
			relations: ["hall", "hall.place"]
		});

		const existedTables = tables.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));
		const updatedTables = existedTables.map((table) => {
			const posterTable = posterTables.find((el) => el.table_id === table.accountingSystemsFields["posterId"]);
			return {
				...table,
				name: posterTable["table_title"] || posterTable["table_num"]
			};
		});

		const existedHalls = await this._hallRepo.find({
			where: {
				place: {
					id: placeId
				}
			},
			relations: ["place"]
		});

		const newTables = posterTables
			.filter(
				(pT) =>
					!existedTables.some((eT) => eT.accountingSystemsFields["posterId"].toString() === pT["table_id"].toString())
			)
			.map(async (nT) => {
				let hall = null;

				hall = existedHalls.find(
					(el) => el.accountingSystemsFields["posterId"].toString() === nT["hall_id"].toString()
				);

				if (!hall) {
					hall = await this._hallRepo.save({
						name: "poster_hall",
						place: { id: placeId },
						accountingSystemsFields: { posterId: nT["hall_id"] }
					});
				}
				return {
					name: nT["table_title"] || nT["table_num"],
					place: {
						id: placeId
					},
					hall,
					code: Number.parseInt((Math.random() * 100).toString()),
					accountingSystemsFields: {
						posterId: nT["table_id"]
					}
				};
			});

		const newTablesPromised = await Promise.all(newTables);
		try {
			await this._tableRepo.save([...updatedTables, ...newTablesPromised]);
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

	async getToken(placeId: string) {
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

		return token;
	}
}

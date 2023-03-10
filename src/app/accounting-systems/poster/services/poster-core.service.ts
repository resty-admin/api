import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { Repository } from "typeorm";

import { environment } from "../../../../environments/environment";
import { PlaceEntity } from "../../../places/entities";
import { ErrorsEnum } from "../../../shared/enums";
import { AccountingSystemEntity, PlaceToAccountingSystemEntity } from "../../entities";
import { PosterService } from "./poster.service";
import { PosterAuthService } from "./poster-auth.service";
import { PosterOrdersService } from "./poster-orders.service";

@Injectable()
export class PosterCoreService {
	constructor(
		private readonly _httpService: HttpService,
		private readonly _posterService: PosterService,
		private readonly _posterAuthService: PosterAuthService,
		private readonly _posterOrderService: PosterOrdersService,
		@InjectRepository(PlaceToAccountingSystemEntity) private readonly _pTa: Repository<PlaceToAccountingSystemEntity>,
		@InjectRepository(AccountingSystemEntity) private readonly _accSystem: Repository<AccountingSystemEntity>,
		@InjectRepository(PlaceEntity) private readonly _placeRepo: Repository<PlaceEntity>
	) {}

	async syncPoster(placeId: string) {
		try {
			const { token, account } = await this.getPlaceConfigs(placeId);

			await this._posterService.syncHalls(placeId, token);
			await this._posterService.syncTables(placeId, token);
			await this._posterService.syncCategories(placeId, token, account);
			await this._posterService.syncProducts(placeId, token, account);

			// await this._posterService.syncIngredientsGroups(placeId, token);
			// await this._posterService.syncIngredients(placeId, token);

			await this._posterOrderService.syncHistoryOrders(placeId, token);

			return "sync done!";
		} catch {
			throw new GraphQLError("jopa", {
				extensions: {
					code: 500
				}
			});
		} finally {}
	}

	async updatePlaceConfigs(token: string, login: string, placeId: string) {
		// const pTas = await this._pTa.find({ relations: ["place", "place.company"] });
		// const currPtA = pTas.find((el) => el?.placeConfigFields["account"] === login);
		//
		// if (!currPtA) {
		// 	throw new GraphQLError(ErrorsEnum.PosterAccountNotFound.toString(), {
		// 		extensions: {
		// 			code: 500
		// 		}
		// 	});
		// }

		const poster = await this._accSystem.findOne({
			where: {
				name: "POSTER"
			}
		});

		const posterToken = await this._posterAuthService.getAccessToken({
			placeId,
			login,
			code: token
		});

		const place = await this._placeRepo.findOne({
			where: {
				id: placeId
			},
			relations: ["company"]
		});

		await this._pTa.save({
			place: {
				id: placeId
			},
			accountingSystem: {
				id: poster.id
			},
			placeConfigFields: {
				account: login,
				access_token: posterToken
			}
		});

		const { adminUrl } = environment.frontEnd;
		await this.syncPoster(place.id);
		return `${adminUrl}/companies/${place.company.id}/places/${place.id}/accounting-systems?poster=success`;
	}

	async getPosterAccSystem() {
		return this._accSystem.findOne({
			where: {
				name: "POSTER"
			}
		});
	}

	async getPlaceConfigs(placeId: string) {
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

		const configs = {
			token: (placeConfigs.placeConfigFields as any).access_token || null,
			account: (placeConfigs.placeConfigFields as any).account || null
		};

		if (!configs.token || !configs.account) {
			throw new GraphQLError(ErrorsEnum.PosterTokenNotExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		return configs;
	}
}

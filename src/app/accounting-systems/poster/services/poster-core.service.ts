import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { Repository } from "typeorm";

import { ErrorsEnum } from "../../../shared/enums";
import { AccountingSystemEntity, PlaceToAccountingSystemEntity } from "../../entities";

@Injectable()
export class PosterCoreService {
	constructor(
		private readonly _httpService: HttpService,
		@InjectRepository(PlaceToAccountingSystemEntity) private readonly _pTa: Repository<PlaceToAccountingSystemEntity>,
		@InjectRepository(AccountingSystemEntity) private readonly _accSystem: Repository<AccountingSystemEntity>
	) {}

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

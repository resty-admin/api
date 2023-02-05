import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as FormData from "form-data";
import { Repository } from "typeorm";

import { environment } from "../../../../environments/environment";
import { PlaceToAccountingSystemEntity } from "../../entities";
import type { PosterAccessCodeInput } from "../dtos/poster-access-code.dto";

@Injectable()
export class PosterAuthService {
	constructor(
		@InjectRepository(PlaceToAccountingSystemEntity) private readonly _pTa: Repository<PlaceToAccountingSystemEntity>,
		private readonly _httpService: HttpService
	) {}

	async getMerchantLoginAndCodeLink(placeId: string) {
		const place = await this.getPosterPlace(placeId);

		const baseUrl = false && environment.production ? `https://dev-api.resty.od.ua` : `http://192.168.68.103:3000`;

		return {
			link: `https://joinposter.com/api/auth?application_id=${
				(place.placeConfigFields as any).application_id
			}&redirect_uri=${baseUrl}/api/poster/auth-confirm&response_type=code`
		};
	}

	async getAccessToken(body: PosterAccessCodeInput) {
		const place = await this.getPosterPlace(body.placeId);

		const baseUrl = "http://192.168.68.103:3000/api/poster/auth-confirm";

		const bodyFormData = new FormData();
		bodyFormData.append("application_id", (place.placeConfigFields as any).application_id);
		bodyFormData.append("application_secret", (place.placeConfigFields as any).application_secret);
		bodyFormData.append("grant_type", "authorization_code");
		bodyFormData.append("code", body.code);
		bodyFormData.append("redirect_uri", baseUrl);

		const res = await this._httpService
			.post(`https://${body.login}.joinposter.com/api/v2/auth/access_token`, bodyFormData)
			.toPromise();

		return this._pTa.save({
			...place,
			placeConfigFields: { ...place.placeConfigFields, access_token: res.data.access_token }
		});
	}

	async getPosterPlace(placeId: string) {
		return this._pTa.findOne({
			where: {
				place: {
					id: placeId
				},
				accountingSystem: {
					name: "POSTER"
				}
			},
			relations: ["accountingSystem"]
		});
	}
}

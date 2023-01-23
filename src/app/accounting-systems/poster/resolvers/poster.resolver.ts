import { Args, Field, Mutation, ObjectType, Resolver } from "@nestjs/graphql";

import { PlaceToAccountingSystemEntity } from "../../entities";
import { PosterAccessCodeInput } from "../dtos/poster-access-code.dto";
import { PosterService } from "../services";
import { PosterAuthService } from "../services/poster-auth.service";

@ObjectType()
export class Link {
	@Field(() => String)
	link: string;
}

@Resolver()
@ObjectType()
export class PosterResolver {
	constructor(private readonly _posterAuthService: PosterAuthService, private readonly _posterService: PosterService) {}

	@Mutation(() => Link)
	async getMerchantLoginAndCodeLink(@Args("placeId") placeId: string) {
		return this._posterAuthService.getMerchantLoginAndCodeLink(placeId);
	}

	@Mutation(() => PlaceToAccountingSystemEntity)
	async getAccessToken(@Args("body") body: PosterAccessCodeInput) {
		return this._posterAuthService.getAccessToken(body);
	}

	@Mutation(() => String)
	async syncHalls(@Args("placeId") placeId: string) {
		return this._posterService.syncHalls(placeId);
	}
}

import { Body, Controller, Get, Post, Query, Res, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

import { PosterCoreService } from "../services/poster-core.service";

@Controller()
export class PosterController {
	constructor(private readonly _posterCoreService: PosterCoreService) {}

	@Get("poster/auth-confirm")
	async posterAuthConfirm(
		@Query("code") code: string,
		@Query("account") account: string,
		@Query("placeId") placeId: string,
		@Res() response: Response
	) {
		const url = await this._posterCoreService.updatePlaceConfigs(code, account, placeId);
		return response.redirect(url);
		// return response.redirect(this._authService.getGoogleRedirectUrl(request.user, request.query.state.toString()));

		// return this._posterCoreService.updatePlaceConfigs(code, account);
	}

	@Post("poster/webhook")
	async posterWebHook(@Body() body: any) {
		console.log("body", body);
		return true;
	}

	@Get("poster/webhook")
	@UseInterceptors(FileInterceptor("input"))
	@UseInterceptors(FileInterceptor("data"))
	async getPosterWebHook() { // @UploadedFile("data") data: Express.Multer.File // @UploadedFile("input") file: Express.Multer.File,
		// console.log("get", file, data);
		return true;
	}
}

import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class PosterController {
	@Get("poster/auth-confirm")
	async posterAuthConfirm(@Query("code") code: string, @Query("account") account: string) {
		console.log("JOPA", code, account);
	}

	@Post("poster/webhook")
	@UseInterceptors(FileInterceptor("input"))
	@UseInterceptors(FileInterceptor("data"))
	async posterWebHook(
		@UploadedFile("input") file: Express.Multer.File,
		@UploadedFile("data") data: Express.Multer.File
	) {
		console.log("body", file, data);
		return true;
	}

	@Get("poster/webhook")
	@UseInterceptors(FileInterceptor("input"))
	@UseInterceptors(FileInterceptor("data"))
	async getPosterWebHook(
		@UploadedFile("input") file: Express.Multer.File,
		@UploadedFile("data") data: Express.Multer.File
	) {
		console.log("get", file, data);
		return true;
	}
}

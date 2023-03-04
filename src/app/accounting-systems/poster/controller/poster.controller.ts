import { Body, Controller, Get, Post, Query } from "@nestjs/common";

@Controller()
export class PosterController {
	@Get("poster/auth-confirm")
	async posterAuthConfirm(@Query("code") code: string, @Query("account") account: string) {
		console.log("JOPA", code, account);
	}

	@Post("poster/webhook")
	async posterWebHook(@Body("body") body: any) {
		console.log("body", body);
		return true;
	}
}

import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AUTH_ENDPOINTS } from "src/app/shared/endpoints";
import type { IAccessToken } from "src/app/shared/interfaces";
import { ITelegramUser, IUser } from "src/app/shared/interfaces";
import { IRequest } from "src/app/shared/interfaces/request.interface";

import { User } from "../../../shared";
import { ForgotPasswordDto, ResetPasswordDto, SignInDto, SignUpDto, VerifyCodeDto } from "../../dtos";
import { GoogleGuard, JwtGuard } from "../../guards";
import { AuthService } from "../../services";

@Controller()
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	// @Get(AUTH_ENDPOINTS.GET_ME)
	// @UseGuards(JwtGuard)
	// async getMe(@User() user: IUser): Promise<IAccessToken> {
	// 	return this._authService.getMe(user);
	// }

	@Post(AUTH_ENDPOINTS.VERIFY_CODE)
	@UseGuards(JwtGuard)
	async verifyCode(@User() user: IUser, @Body() body: VerifyCodeDto) {
		return this._authService.verifyCode(user, body);
	}

	@Post(AUTH_ENDPOINTS.SIGN_IN)
	async signIn(@Body() body: SignInDto): Promise<IAccessToken> {
		return this._authService.signIn(body);
	}

	@Post(AUTH_ENDPOINTS.SIGN_UP)
	async signUp(@Body() body: SignUpDto): Promise<IAccessToken> {
		return this._authService.signUp(body);
	}

	@Post(AUTH_ENDPOINTS.FORGOT_PASSWOR)
	async forgotPassword(@Body() body: ForgotPasswordDto) {
		return this._authService.forgotPassword(body);
	}

	@Post(AUTH_ENDPOINTS.RESET_PASSWOR)
	@UseGuards(JwtGuard)
	async resetPassword(@User() user: IUser, @Body() body: ResetPasswordDto): Promise<IAccessToken> {
		return this._authService.resetPassword(user, body);
	}

	@Get(AUTH_ENDPOINTS.GOOGLE)
	@UseGuards(GoogleGuard)
	google() {
		// Google  Endpoint
	}

	@Get(AUTH_ENDPOINTS.GOOGLE_CALLBACK)
	@UseGuards(GoogleGuard)
	async googleCallback(@Req() request: IRequest, @Res() response: Response) {
		return response.redirect(this._authService.getGoogleRedirectUrl(request.user, request.query.state.toString()));
	}

	@Post(AUTH_ENDPOINTS.TELEGRAM)
	async telegram(@Body() telegramUser: ITelegramUser) {
		return this._authService.telegram(telegramUser);
	}

	@Get(AUTH_ENDPOINTS.TELEGRAM_CALLBACK)
	async telegramCallback(@Query() telegramUser: ITelegramUser, @Res() response: Response) {
		response.redirect(await this._authService.getTelegramRedirectUrl(telegramUser));
	}
}

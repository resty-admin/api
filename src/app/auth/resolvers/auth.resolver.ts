import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { UserGql } from "../../shared";
import { IUser } from "../../shared/interfaces";
import { UserEntity } from "../../users/entities";
import { ForgotPasswordInput, ResetPasswordInput, SignInInput, SignUpInput, VerifyCodeInput } from "../dtos";
import { TelegramUserInput } from "../dtos/telegram-user.dto";
import { AccessToken } from "../dtos/token.dto";
import { UpdateMeInput } from "../dtos/update-me.dto";
import { GqlJwtGuard } from "../guards";
import { AuthService } from "../services";

@Resolver(() => UserEntity)
export class AuthResolver {
	constructor(private readonly _authService: AuthService) {}

	@Query(() => AccessToken)
	@UseGuards(GqlJwtGuard)
	async getMe(@UserGql() user: IUser) {
		return this._authService.getMe(user);
	}

	@Mutation(() => UserEntity)
	@UseGuards(GqlJwtGuard)
	async updateMe(@Args("user") user: UpdateMeInput, @UserGql() userGql: IUser) {
		return this._authService.updateMe(user, userGql);
	}

	@Mutation(() => AccessToken)
	@UseGuards(GqlJwtGuard)
	async verifyCode(@UserGql() user: IUser, @Args("code") code: VerifyCodeInput) {
		return this._authService.verifyCode(user, code);
	}

	@Mutation(() => AccessToken)
	@UseGuards(GqlJwtGuard)
	async signIn(@Args("body") body: SignInInput) {
		return this._authService.signIn(body);
	}

	@Mutation(() => AccessToken)
	async signUp(@Args("body") body: SignUpInput) {
		return this._authService.signUp(body);
	}

	@Mutation(() => String)
	async forgotPassword(@Args("body") body: ForgotPasswordInput) {
		return this._authService.forgotPassword(body);
	}

	@Mutation(() => AccessToken)
	@UseGuards(GqlJwtGuard)
	async resetPassword(@UserGql() user: IUser, @Args("body") body: ResetPasswordInput) {
		return this._authService.resetPassword(user, body);
	}

	@Mutation(() => AccessToken)
	async telegram(@Args("telegramUser") telegramUser: TelegramUserInput) {
		return this._authService.telegram(telegramUser);
	}

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard)
	async deleteMe(@UserGql() userGql: IUser) {
		return this._authService.deleteMe(userGql.id);
	}
}

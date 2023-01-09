import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { UserGql } from "../../shared";
import { IUser } from "../../shared/interfaces";
import { UserEntity } from "../../users/entities";
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

	// @Mutation(() => )
	// @Post(AUTH_ENDPOINTS.VERIFY_CODE)
	// @UseGuards(JwtGuard)
	// async verifyCode(@User() user: IUser, @Body() body: VerifyCodeDto) {
	// 	return this._authService.verifyCode(user, body);
	// }

	@Mutation(() => String)
	@UseGuards(GqlJwtGuard)
	async deleteMe(@UserGql() userGql: IUser) {
		return this._authService.deleteMe(userGql.id);
	}
}

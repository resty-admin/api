import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { Random } from "random-js";
import { CryptoService } from "src/app/shared/crypto";
import { ErrorsEnum, UserStatusEnum } from "src/app/shared/enums";
import type {
	IAccessToken,
	IForgotPassword,
	IGoogleProfile,
	IResetPassword,
	ISignIn,
	ISignUp,
	ITelegramUser,
	IUser
} from "src/app/shared/interfaces";
import { JwtService } from "src/app/shared/jwt";
import { MailsService } from "src/app/shared/mails";
import { MessagesService } from "src/app/shared/messages";
import { removeFirstSlash } from "src/app/shared/utils";

// import { ActiveOrderEntity } from "../../../commands/entities";
import { UsersService } from "../../../users";
import { UserEntity } from "../../../users/entities";

@Injectable()
export class AuthService {
	private readonly _random = new Random();

	constructor(
		private readonly _usersService: UsersService,
		private readonly _jwtService: JwtService,
		private readonly _messagesService: MessagesService,
		private readonly _cryptoService: CryptoService,
		private readonly _mailsService: MailsService,
		@InjectRepository(UserEntity) private readonly _usersRepository
	) {}

	async validate(user: IUser): Promise<IUser> {
		return this._usersService.getUser({ id: user.id });
	}

	async getMe(user: IUser): Promise<IAccessToken> {
		const me = await this._usersService.getUser({ id: user.id });

		if (!me) {
			throw new GraphQLError(ErrorsEnum.UserNotExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		return this._jwtService.getAccessToken(me);
	}

	async updateMe(updatedUser: any, userGql) {
		return this._usersService.updateUser(userGql.id, updatedUser);
	}

	async deleteMe(id) {
		const user = await this._usersRepository.findOne({ where: { id }, relations: ["orders"] });

		if (user.orders.length > 0) {
			throw new GraphQLError(ErrorsEnum.ActiveOrderExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		await this._usersService.deleteUser(id);
		return "DELETED";
	}

	async verifyCode(user: IUser, code: number) {
		const isVerified = Number(user?.verificationCode) === Number(code);

		if (!isVerified) {
			throw new GraphQLError(ErrorsEnum.InvalidVerificationCode.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const verifiedUser = await this._usersService.updateUser(user.id, {
			...user,
			status: UserStatusEnum.VERIFIED,
			verificationCode: 0o000
		});

		return this._jwtService.getAccessToken(verifiedUser);
	}

	async signUp(body: ISignUp) {
		const existedUser = await this._usersService.getUser({
			...("email" in body ? { email: body.email } : {}),
			...("tel" in body ? { tel: body.tel } : {})
		});

		if (existedUser) {
			throw new GraphQLError(ErrorsEnum.UserAlreadyExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const isPasswordEncrypted = this._cryptoService.check(body.password);

		if (!isPasswordEncrypted) {
			throw new GraphQLError(ErrorsEnum.InvalidEncryption.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const verificationCode = this._random.integer(1000, 9999);

		const createdUser = await this._usersService.createUser({ ...body, verificationCode });

		if ("email" in body) {
			// await this._mailsService.send(body.email, verificationCode.toString());
		}

		if ("tel" in body) {
			// await this._messagesService.send(body.tel, verificationCode.toString());
		}

		return this._jwtService.getAccessToken(createdUser);
	}

	async signIn(body: ISignIn): Promise<IAccessToken> {
		const existedUser = await this._usersService.getUser({
			...("email" in body ? { email: body.email } : {}),
			...("tel" in body ? { tel: body.tel } : {})
		});

		if (!existedUser) {
			throw new GraphQLError(ErrorsEnum.UserNotExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const isPasswordEncrypted = this._cryptoService.check(body.password);

		if (!isPasswordEncrypted) {
			throw new GraphQLError(ErrorsEnum.InvalidEncryption.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const isPasswordCompared = this._cryptoService.compare(body.password, existedUser.password);

		if (!isPasswordCompared) {
			throw new GraphQLError(ErrorsEnum.InvalidPassword.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const isUserVerified = existedUser.status === UserStatusEnum.NOT_VERIFIED;

		if (isUserVerified) {
			throw new GraphQLError(ErrorsEnum.UserNotVerified.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		return this._jwtService.getAccessToken(existedUser);
	}

	async forgotPassword(body: IForgotPassword) {
		const existedUser = await this._usersService.getUser({
			...("email" in body ? { email: body.email } : {}),
			...("tel" in body ? { tel: body.tel } : {})
		});

		if (!existedUser) {
			throw new GraphQLError(ErrorsEnum.UserNotExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const token = this._jwtService.getAccessToken(existedUser);
		const resetPasswordLink = `http://192.168.68.100:4200/auth/reset-password/${token}`;

		if ("email" in body) {
			await this._mailsService.send(body.email, resetPasswordLink);
		} else if ("tel" in body) {
			await this._messagesService.send(body.tel, resetPasswordLink);
		}

		return "success";
	}

	async resetPassword(user: IUser, body: IResetPassword) {
		const isPasswordEncrypted = this._cryptoService.check(body.password);

		if (!isPasswordEncrypted) {
			throw new GraphQLError(ErrorsEnum.InvalidEncryption.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const updatedUser = await this._usersService.updateUser(user.id, body);

		return this._jwtService.getAccessToken(updatedUser);
	}

	async google(profile: IGoogleProfile) {
		const { id, displayName, emails } = profile;

		const findedUser = await this._usersService.getUser({ googleId: id });

		if (findedUser) {
			return findedUser;
		}

		return this._usersService.updateUser(id, {
			googleId: id,
			name: displayName,
			email: emails[0].value,
			status: UserStatusEnum.VERIFIED
		});
	}

	getGoogleRedirectUrl(user: IUser, domain: string) {
		const { accessToken } = this._jwtService.getAccessToken(user);

		return `${domain}${removeFirstSlash("ADMIN_ROUTES.GOOGLE.absolutePath")}/${accessToken}`;
	}

	async telegram({ id, first_name, last_name }: ITelegramUser) {
		const existUser = await this._usersService.getUser({ telegramId: id });

		if (existUser) {
			return this._jwtService.getAccessToken(existUser);
		}

		const createdUser = await this._usersService.createUser({
			telegramId: id,
			name: `${first_name || ""} ${last_name || ""}`,
			status: UserStatusEnum.VERIFIED
		});

		return this._jwtService.getAccessToken(createdUser);
	}

	async getTelegramRedirectUrl(telegramUser: ITelegramUser) {
		const { accessToken } = await this.telegram(telegramUser);

		return `${""}/${accessToken}`;
	}
}

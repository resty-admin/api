import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { Random } from "random-js";
import { CryptoService } from "src/app/shared/crypto";
import { ErrorsEnum, UserRoleEnum, UserStatusEnum } from "src/app/shared/enums";
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
		if (updatedUser.role && updatedUser.role === UserRoleEnum.ADMIN) {
			throw new GraphQLError(ErrorsEnum.Forbidden.toString(), {
				extensions: {
					code: 500
				}
			});
		}

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

	async sendAgain(user: IUser) {
		const existedUser = await this._usersService.getUser({ id: user.id });

		if (!existedUser) {
			throw new GraphQLError(ErrorsEnum.UserNotExist.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		if (existedUser.email !== null) {
			await this._mailsService.send(existedUser.email, existedUser.verificationCode.toString(), {
				subject: "Account verification"
			});
		}

		if (existedUser.tel !== null) {
			await this._messagesService.send(existedUser.tel, existedUser.verificationCode.toString());
		}

		return "success";
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

		const isPasswordCompared = await this._cryptoService.compare(
			this._cryptoService.decrypt(body.password),
			existedUser.password
		);

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

		const verificationCode = this._random.integer(1000, 9000);

		const createdUser = await this._usersService.createUser({ ...body, verificationCode });

		if ("email" in body) {
			await this._mailsService.send(body.email, verificationCode.toString(), { subject: "Account verification" });
		}

		if ("tel" in body) {
			await this._messagesService.send(body.tel, verificationCode.toString());
		}

		return this._jwtService.getAccessToken(createdUser);
	}

	async forgotPassword(body: IForgotPassword, context) {
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

		const { accessToken } = this._jwtService.getAccessToken(existedUser);
		// const { adminUrl } = environment.frontEnd;

		const headerIdx = context.req.rawHeaders.indexOf("Origin");
		const originUrl = context.req.rawHeaders[headerIdx + 1];
		const resetPasswordLink = `${originUrl}/auth/reset-password/${accessToken}`;

		if ("email" in body) {
			await this._mailsService.send(body.email, resetPasswordLink, { subject: "Password reset" });
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

		const plainPass = this._cryptoService.decrypt(body.password);
		const updatePass = await this._cryptoService.hash(plainPass);
		const updatedUser = await this._usersService.updateUser(user.id, { ...body, password: updatePass });

		return this._jwtService.getAccessToken(updatedUser);
	}

	async google(profile: IGoogleProfile) {
		const { id, displayName, emails } = profile;

		const findedUser = await this._usersService.getUser({ googleId: id });

		if (findedUser) {
			return findedUser;
		}

		return this._usersService.createUser({
			googleId: id,
			name: displayName,
			status: UserStatusEnum.VERIFIED,
			email: emails[0].value
		});
	}

	getGoogleRedirectUrl(user: IUser, domain: string) {
		const { accessToken } = this._jwtService.getAccessToken(user);

		return `${domain}auth/google/${accessToken}`;
	}

	async telegram({ id, first_name, last_name, role }: ITelegramUser) {
		const existUser = await this._usersService.getUser({ telegramId: id });

		if (existUser) {
			return this._jwtService.getAccessToken(existUser);
		}

		const createdUser = await this._usersService.createUser({
			telegramId: id,
			name: `${first_name || ""} ${last_name || ""}`,
			status: UserStatusEnum.VERIFIED,
			role
		});

		return this._jwtService.getAccessToken(createdUser);
	}

	async getTelegramRedirectUrl(telegramUser: ITelegramUser) {
		const { accessToken } = await this.telegram(telegramUser);

		return `${""}/${accessToken}`;
	}
}

import { Module } from "@nestjs/common";

import { CryptoModule } from "../shared/crypto";
import { JwtModule } from "../shared/jwt";
import { MailsModule } from "../shared/mails";
import { MessagesModule } from "../shared/messages";
import { UsersModule } from "../users";
import { CRYPTO_CONFIG, JWT_CONFIG, MAILS_CONFIG, MESSAGES_CONFIG } from "./configs";
import { AUTH_CONTROLLERS } from "./controllers";
import { AUTH_RESOLVERS } from "./resolvers";
import { AUTH_SERVICES } from "./services";
import { AUTH_STRATEGIES } from "./strategies";
import { AUTH_SUBSCRIBERS } from "./subscribers";

@Module({
	controllers: AUTH_CONTROLLERS,
	imports: [
		JwtModule.forRoot(JWT_CONFIG),
		MailsModule.forRoot(MAILS_CONFIG),
		MessagesModule.forRoot(MESSAGES_CONFIG),
		CryptoModule.forRoot(CRYPTO_CONFIG),
		UsersModule
	],
	providers: [...AUTH_SERVICES, ...AUTH_STRATEGIES, ...AUTH_SUBSCRIBERS, ...AUTH_RESOLVERS],
	exports: AUTH_SERVICES
})
export class AuthModule {}

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { IUser } from "src/app/shared/interfaces";

import { environment } from "../../../environments/environment";
import { AuthService } from "../services";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly _authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: environment.jwtSecret
		});
	}

	async validate(user: IUser) {
		return this._authService.validate(user);
	}
}

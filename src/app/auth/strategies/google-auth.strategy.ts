import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";

import { GOOGLE_CONFIG } from "../configs";
import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, "google") {
	constructor(private readonly _authService: AuthService) {
		super(GOOGLE_CONFIG);
	}

	async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
		try {
			const user = await this._authService.google(profile);

			done(null, user);
		} catch (error) {
			done(error, false);
		}
	}
}

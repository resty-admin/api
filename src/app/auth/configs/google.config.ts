import { environment } from "../../../environments/environment";

export const GOOGLE_CONFIG = {
	clientID: environment.googleId,
	clientSecret: environment.googleSecret,
	callbackURL: environment.googleCallback,
	passReqToCallback: true,
	scope: ["profile", "email"]
};

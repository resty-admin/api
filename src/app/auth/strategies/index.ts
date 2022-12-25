import { GoogleAuthStrategy } from "./google-auth.strategy";
import { JwtAuthStrategy } from "./jwt-auth.strategy";

export const AUTH_STRATEGIES = [JwtAuthStrategy, GoogleAuthStrategy];

export * from "./google-auth.strategy";
export * from "./jwt-auth.strategy";

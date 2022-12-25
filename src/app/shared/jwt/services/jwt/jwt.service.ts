import { Injectable } from "@nestjs/common";
import { JwtService as _JwtService } from "@nestjs/jwt";
import { instanceToPlain } from "class-transformer";
import { ACCESS_TOKEN } from "src/app/shared/constants";

@Injectable()
export class JwtService {
	constructor(private readonly _jwtService: _JwtService) {}

	getAccessToken(payload: Buffer | object | string) {
		return {
			[ACCESS_TOKEN]: this._jwtService.sign(instanceToPlain(payload))
		};
	}

	decode<T>(jwt: string) {
		return this._jwtService.decode(jwt) as T;
	}

	verify(jwt: string) {
		return this._jwtService.verify(jwt);
	}
}

import * as CryptoJS from "crypto-js";

export class CryptoJs {
	constructor(private readonly _secret: string) {}

	// Password Crypting
	check(data: string) {
		return CryptoJS.AES.decrypt(data, this._secret).toString(CryptoJS.enc.Utf8).length > 0;
	}

	encrypt(data: string) {
		return CryptoJS.AES.encrypt(JSON.stringify(data), this._secret, { mode: CryptoJS.mode.ECB }).toString();
	}

	decrypt(data: string) {
		return CryptoJS.AES.decrypt(data, this._secret).toString(CryptoJS.enc.Utf8);
	}

	// JWT
	base64url(source: any) {
		// Encode in classical base64
		let encodedSource: any = CryptoJS.enc.Base64.stringify(source);

		// Remove padding equal characters
		// eslint-disable-next-line
		encodedSource = encodedSource.replace(/=+$/, "");

		// Replace characters according to base64url specifications
		encodedSource = encodedSource.replaceAll("+", "-");
		encodedSource = encodedSource.replaceAll("/", "_");

		return encodedSource;
	}

	getAccessToken(data: unknown) {
		const header = {
			alg: "HS256",
			typ: "JWT"
		};

		const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
		const encodedHeader = this.base64url(stringifiedHeader);

		const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
		const encodedData = this.base64url(stringifiedData);

		const token = `${encodedHeader}.${encodedData}`;

		const signature = CryptoJS.HmacSHA256(token, this._secret);
		const encodedSignature = this.base64url(signature);

		return `${token}.${encodedSignature}`;
	}
}

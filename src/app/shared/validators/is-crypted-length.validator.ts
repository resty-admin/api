import type { ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { ErrorsEnum } from "src/app/shared/enums";

import { environment } from "../../../environments/environment";
import { CryptoJs } from "../crypto/crypto-js.class";

const crypto = new CryptoJs(environment.cryptoSecret);

export function IsCryptedLength(length: number, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "IsCryptedLength",
			target: object.constructor,
			propertyName,
			constraints: [propertyName],
			options: { message: ErrorsEnum.InvalidEncryptionLength.toString(), ...validationOptions },
			validator: {
				validate(value: string) {
					return crypto.decrypt(value).length > length;
				}
			}
		});
	};
}

import type { ICryptoConfig } from "src/app/shared/crypto";

import { environment } from "../../../environments/environment";

export const CRYPTO_CONFIG: ICryptoConfig = {
	secret: environment.cryptoSecret
};

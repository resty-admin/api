import type { IJwtConfig } from "src/app/shared/jwt";

import { environment } from "../../../environments/environment";

export const JWT_CONFIG: IJwtConfig = {
	secret: environment.jwtSecret
};

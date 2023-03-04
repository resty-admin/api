import { PosterService } from "./poster.service";
import { PosterAuthService } from "./poster-auth.service";
import { PosterCoreService } from "./poster-core.service";
import { PosterOrdersService } from "./poster-orders.service";

export const POSTER_SERVICES = [PosterService, PosterAuthService, PosterOrdersService, PosterCoreService];

export * from "./poster.service";

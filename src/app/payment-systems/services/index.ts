import { FondyService } from "./fondy.service";
import { PaymentSystemsService } from "./payment-systems.service";

export const PAYMENT_SYSTEMS_SERVICES = [PaymentSystemsService, FondyService];

export * from "./payment-systems.service";

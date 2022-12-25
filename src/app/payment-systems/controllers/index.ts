import { FondyController } from "./fondy.controller";
import { PaymentSystemsController } from "./payment-systems.controller";

export const PAYMENT_SYSTEMS_CONTROLLERS = [PaymentSystemsController, FondyController];

export * from "./fondy.controller";
export * from "./payment-systems.controller";

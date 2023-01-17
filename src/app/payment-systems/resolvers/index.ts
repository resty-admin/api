import { FondyResolver } from "./fondy.resolver";
import { PaymentSystemsResolver } from "./payment-systems.resolver";

export const PAYMENT_SYSTEMS_RESOLVERS = [PaymentSystemsResolver, FondyResolver];

export * from "./payment-systems.resolver";

import { ActiveOrderEntity } from "./active-order.entity";
import { HistoryOrderEntity } from "./history-order.entity";
import { ProductToOrderEntity } from "./product-to-order.entity";

export const ORDERS_ENTITIES = [ActiveOrderEntity, HistoryOrderEntity, ProductToOrderEntity];

export * from "./active-order.entity";
export * from "./history-order.entity";
export * from "./product-to-order.entity";

import { ActiveOrderEntity } from "./active-order.entity";
import { HistoryOrderEntity } from "./history-order.entity";
import { UserToOrderEntity } from "./user-to-order.entity";

export const ORDERS_ENTITIES = [ActiveOrderEntity, HistoryOrderEntity, UserToOrderEntity];

export * from "./active-order.entity";
export * from "./history-order.entity";
export * from "./user-to-order.entity";

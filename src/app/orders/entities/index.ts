import { ActiveOrderEntity } from "./active-order.entity";
import { AttributeToProductEntity } from "./attribute-to-product.entity";
import { HistoryOrderEntity } from "./history-order.entity";
import { ProductToOrderEntity } from "./product-to-order.entity";

export const ORDERS_ENTITIES = [ActiveOrderEntity, HistoryOrderEntity, ProductToOrderEntity, AttributeToProductEntity];

export * from "./active-order.entity";
export * from "./attribute-to-product.entity";
export * from "./history-order.entity";
export * from "./product-to-order.entity";

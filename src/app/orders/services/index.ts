import { OrdersNotificationsService } from "./orders.notifications.service";
import { OrdersService } from "./orders.service";
import { ProductToOrderService } from "./product-to-order.service";

export const ORDERS_SERVICES = [OrdersService, OrdersNotificationsService, ProductToOrderService];

export * from "./orders.notifications.service";
export * from "./orders.service";
export * from "./product-to-order.service";

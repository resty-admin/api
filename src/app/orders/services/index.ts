import { OrdersNotificationsService } from "./orders.notifications.service";
import { OrdersService } from "./orders.service";

export const ORDERS_SERVICES = [OrdersService, OrdersNotificationsService];

export * from "./orders.notifications.service";
export * from "./orders.service";

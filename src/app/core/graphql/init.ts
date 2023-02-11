import { registerEnumType } from "@nestjs/graphql";
import {
	AttributeGroupTypeEnum,
	OrderStatusEnum,
	OrderTypeEnum,
	PlaceStatusEnum,
	PlaceVerificationStatusEnum,
	ProductToOrderPaidStatusEnum,
	ProductToOrderStatusEnum,
	ThemeEnum,
	UserRoleEnum,
	UserStatusEnum
} from "src/app/shared/enums";

import { ORDERS_EVENTS } from "../../orders/gateways/events/order.event";

export function initGraphql() {
	registerEnumType(UserRoleEnum, { name: "UserRoleEnum" });
	registerEnumType(UserStatusEnum, { name: "UserStatusEnum" });
	registerEnumType(ThemeEnum, { name: "ThemeEnum" });
	registerEnumType(PlaceStatusEnum, { name: "PlaceStatusEnum" });
	registerEnumType(OrderStatusEnum, { name: "OrderStatusEnum" });
	registerEnumType(OrderTypeEnum, { name: "OrderTypeEnum" });
	registerEnumType(AttributeGroupTypeEnum, { name: "AttributeGroupTypeEnum" });
	registerEnumType(ProductToOrderStatusEnum, { name: "ProductToOrderStatusEnum" });
	registerEnumType(ProductToOrderPaidStatusEnum, { name: "ProductToOrderPaidStatusEnum" });
	// registerEnumType(TableStatusEnum, { name: "TableStatusEnum" });
	registerEnumType(PlaceVerificationStatusEnum, { name: "PlaceVerificationStatusEnum" });
	registerEnumType(ORDERS_EVENTS, { name: "OrdersEvents" });
}

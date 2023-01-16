import { registerEnumType } from "@nestjs/graphql";
import {
	AttributeGroupTypeEnum,
	OrderStatusEnum,
	OrderTypeEnum,
	PlaceStatusEnum,
	ProductToOrderPaidStatusEnum,
	ProductToOrderStatusEnum,
	ThemeEnum,
	UserRoleEnum,
	UserStatusEnum
} from "src/app/shared/enums";

import { TableStatusEnum } from "../../shared/enums/orders/table-status.enum";

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
	registerEnumType(TableStatusEnum, { name: "TableStatusEnum" });
}

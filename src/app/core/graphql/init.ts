import { registerEnumType } from "@nestjs/graphql";
import {
	OrderStatusEnum,
	OrderTypeEnum,
	PlaceStatusEnum,
	ThemeEnum,
	UserRoleEnum,
	UserStatusEnum
} from "src/app/shared/enums";

export function initGraphql() {
	registerEnumType(UserRoleEnum, { name: "UserRoleEnum" });
	registerEnumType(UserStatusEnum, { name: "UserStatusEnum" });
	registerEnumType(ThemeEnum, { name: "ThemeEnum" });
	registerEnumType(PlaceStatusEnum, { name: "PlaceStatusEnum" });
	registerEnumType(OrderStatusEnum, { name: "OrderStatusEnum" });
	registerEnumType(OrderTypeEnum, { name: "OrderTypeEnum" });
}

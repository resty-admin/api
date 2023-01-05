import { ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { OrderStatusEnum, OrderTypeEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { HISTORY_ORDERS } from "../constant";

@Entity({ name: HISTORY_ORDERS })
export class HistoryOrderEntity extends BaseEntity {
	@Column("int", { unique: true })
	orderNumber: number;

	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	table?: string;

	@Column({
		type: "jsonb",
		array: false,
		default: () => "'[]'",
		nullable: true
	})
	users: IUser[];

	@Column("enum", { enum: OrderTypeEnum })
	type: OrderTypeEnum;

	@Column("enum", { enum: OrderStatusEnum, default: OrderStatusEnum.CLOSED })
	status: OrderStatusEnum;

	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`
	})
	place: string;

	@Column({ nullable: true })
	totalPrice?: number;

	@Column({
		type: "jsonb",
		array: false,
		default: () => "'[]'",
		nullable: true
	})
	usersToOrders?: string[];
}

@ObjectType()
export class PaginatedHistoryOrder extends Pagination(HistoryOrderEntity) {}

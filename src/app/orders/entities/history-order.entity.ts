import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { OrderStatusEnum, OrderTypeEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { HISTORY_ORDERS } from "../constant";

@Entity({ name: HISTORY_ORDERS })
@ObjectType()
export class HistoryOrderEntity extends BaseEntity {
	@Column("int", { unique: true })
	@Field(() => Int)
	orderNumber: number;

	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	@Field(() => [String], { nullable: true })
	table?: string;

	@Column({
		type: "jsonb",
		array: false,
		default: () => "'[]'",
		nullable: true
	})
	@Field(() => [String])
	users: IUser[];

	@Column("enum", { enum: OrderTypeEnum })
	@Field(() => OrderTypeEnum)
	type: OrderTypeEnum;

	@Column("enum", { enum: OrderStatusEnum, default: OrderStatusEnum.CLOSED })
	@Field(() => OrderStatusEnum)
	status: OrderStatusEnum;

	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`
	})
	@Field(() => String)
	place: string;

	@Column({ nullable: true })
	@Field(() => Int, { nullable: true })
	totalPrice?: number;

	@Column({
		type: "jsonb",
		array: false,
		default: () => "'[]'",
		nullable: true
	})
	@Field(() => [String])
	usersToOrders?: string[];
}

@ObjectType()
export class PaginatedHistoryOrder extends Pagination(HistoryOrderEntity) {}

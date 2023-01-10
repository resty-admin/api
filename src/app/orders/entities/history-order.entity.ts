import { Field, Int, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, ManyToOne } from "typeorm";

import { PlaceEntity } from "../../places/entities";
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
	@Field(() => GraphQLJSONObject, { nullable: true })
	table?: object;

	@Column({
		type: "jsonb",
		array: false,
		default: () => "'[]'",
		nullable: true
	})
	@Field(() => [GraphQLJSONObject])
	users: IUser[];

	@Column("enum", { enum: OrderTypeEnum })
	@Field(() => OrderTypeEnum)
	type: OrderTypeEnum;

	@Column("enum", { enum: OrderStatusEnum, default: OrderStatusEnum.CLOSED })
	@Field(() => OrderStatusEnum)
	status: OrderStatusEnum;

	// @Column({
	// 	type: "json",
	// 	default: () => `('${JSON.stringify({})}')`
	// })
	// @Field(() => GraphQLJSONObject)
	// place: object;

	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.orders)
	place: PlaceEntity;

	@Column({ nullable: true })
	@Field(() => Int, { nullable: true })
	totalPrice?: number;

	@Column({
		type: "jsonb",
		array: false,
		default: () => "'[]'",
		nullable: true
	})
	@Field(() => [GraphQLJSONObject])
	usersToOrders?: object[];
}

@ObjectType()
export class PaginatedHistoryOrder extends Pagination(HistoryOrderEntity) {}

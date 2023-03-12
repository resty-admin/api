import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, ManyToOne } from "typeorm";

import { AccountingSystemsEnum } from "../../accounting-systems/enums";
import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { OrderStatusEnum, OrderTypeEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { HISTORY_ORDERS } from "../constant";

@Entity({ name: HISTORY_ORDERS })
@ObjectType()
export class HistoryOrderEntity extends BaseEntity {
	@Column("int", { nullable: true })
	@Field(() => Int, { nullable: true })
	orderNumber?: number;

	@Column({
		type: "jsonb",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	@Field(() => GraphQLJSONObject, { nullable: true })
	table?: object;

	@Column({
		type: "jsonb",
		array: false,
		default: () => `('${JSON.stringify({})}')`,
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

	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.orders)
	place: PlaceEntity;

	@Column({ nullable: true, type: "real" })
	@Field(() => Float, { nullable: true })
	totalPrice?: string;

	@Column({
		type: "jsonb",
		array: false,
		default: () => "'[]'",
		nullable: true
	})
	@Field(() => [GraphQLJSONObject])
	productsToOrders?: object[];

	@Field(() => Date, { nullable: true })
	@Column({ nullable: true })
	startDate?: Date;

	@Field(() => AccountingSystemsEnum)
	@Column("enum", { enum: AccountingSystemsEnum, default: AccountingSystemsEnum.RESTY })
	accountingSystem: AccountingSystemsEnum;

	@Field(() => String, { nullable: true })
	@Column({ nullable: true })
	accountingSystemId?: string;
}

@ObjectType()
export class PaginatedHistoryOrder extends Pagination(HistoryOrderEntity) {}

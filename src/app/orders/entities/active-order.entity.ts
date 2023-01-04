import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { OrderStatusEnum, OrderTypeEnum } from "../../shared/enums";
import { TableEntity } from "../../tables/entities";
import { UserEntity } from "../../users/entities";
import { ACTIVE_ORDERS } from "../constant";
import { UserToOrderEntity } from "./user-to-order.entity";

@ObjectType()
@InputType("ActiveOrderEntityInput")
@Entity({ name: ACTIVE_ORDERS })
export class ActiveOrderEntity extends BaseEntity {
	@Column({ unique: true })
	@Field(() => Int)
	orderCode: number;

	@Field(() => TableEntity, { nullable: true })
	@ManyToOne(() => TableEntity, (table) => table.orders, { nullable: true })
	table?: TableEntity;

	@Field(() => [UserEntity], { nullable: true })
	@ManyToMany(() => UserEntity, (user) => user.orders, { nullable: true })
	@JoinTable()
	users: UserEntity[];

	@Field(() => OrderTypeEnum)
	@Column("enum", { enum: OrderTypeEnum })
	type: OrderTypeEnum;

	@Field(() => OrderStatusEnum)
	@Column("enum", { enum: OrderStatusEnum, default: OrderStatusEnum.OPENED })
	status: OrderStatusEnum;

	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.orders)
	place: PlaceEntity;

	@Field(() => Int, { nullable: true })
	@Column("int", { nullable: true })
	totalPrice?: number;

	@Field(() => [UserToOrderEntity], { nullable: true })
	@OneToMany(() => UserToOrderEntity, (uTo) => uTo.order, { nullable: true, cascade: true })
	usersToOrders?: UserToOrderEntity[];
}

@ObjectType()
export class PaginatedActiveOrder extends Pagination(ActiveOrderEntity) {}

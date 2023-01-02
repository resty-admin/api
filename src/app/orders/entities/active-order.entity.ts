import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, Generated, ManyToOne, OneToMany } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { BaseEntity, IsNotEmpty, IsNumber } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { OrderStatusEnum, OrderTypeEnum } from "../../shared/enums";
import { TableEntity } from "../../tables/entities";
import { ACTIVE_ORDERS } from "../constant";
import { UserToOrderEntity } from "./user-to-order.entity";

@ObjectType()
@InputType("ActiveOrderEntityInput")
@Entity({ name: ACTIVE_ORDERS })
export class ActiveOrderEntity extends BaseEntity {
	@Generated("increment")
	@Column("int", { unique: true })
	@Field(() => String)
	orderCode: number;

	@Field(() => TableEntity, { nullable: true })
	@ManyToOne(() => TableEntity, (table) => table.orders, { nullable: true })
	table?: TableEntity;

	// @Field(() => [UserEntity])
	// @ManyToMany(() => UserEntity, (user) => user.orders)
	// @JoinTable()
	// users: UserEntity[];

	@Field(() => OrderTypeEnum)
	@Column("enum", { enum: OrderTypeEnum })
	type: OrderTypeEnum;

	@Field(() => OrderStatusEnum)
	@Column("enum", { enum: OrderStatusEnum, default: OrderStatusEnum.OPENED })
	status: OrderStatusEnum;

	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.orders)
	place: PlaceEntity;

	@Field(() => Int)
	@Column("int")
	@IsNumber()
	@IsNotEmpty()
	totalPrice?: number;

	@Field(() => [UserToOrderEntity], { nullable: true })
	@OneToMany(() => UserToOrderEntity, (uTo) => uTo.order, { nullable: true, cascade: true })
	usersToOrders?: UserToOrderEntity[];
}

@ObjectType()
export class PaginatedActiveOrder extends Pagination(ActiveOrderEntity) {}

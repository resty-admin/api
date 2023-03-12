import { Field, Float, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, Generated, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { OrderStatusEnum, OrderTypeEnum } from "../../shared/enums";
import { TableEntity } from "../../tables/entities";
import { UserEntity } from "../../users/entities";
import { ACTIVE_ORDERS } from "../constant";
import { ProductToOrderEntity } from "./product-to-order.entity";

@ObjectType()
@InputType("ActiveOrderEntityInput")
@Entity({ name: ACTIVE_ORDERS })
export class ActiveOrderEntity extends BaseEntity {
	@Column({ unique: true })
	@Field(() => Int)
	code: number;

	@Generated("increment")
	@Column("int", { unique: true })
	@Field(() => Int)
	orderNumber: number;

	@Field(() => TableEntity, { nullable: true })
	@ManyToOne(() => TableEntity, (table) => table.orders, { nullable: true })
	table?: TableEntity;

	// @Field(() => TableStatusEnum)
	// @Column("enum", { enum: TableStatusEnum, default: TableStatusEnum.EMPTY })
	// tableStatus: TableStatusEnum;

	@Field(() => [UserEntity], { nullable: true })
	@ManyToMany(() => UserEntity, (user) => user.orders, { nullable: true })
	@JoinTable()
	users: UserEntity[];

	@Field(() => OrderTypeEnum)
	@Column("enum", { enum: OrderTypeEnum })
	type: OrderTypeEnum;

	@Field(() => OrderStatusEnum)
	@Column("enum", { enum: OrderStatusEnum, default: OrderStatusEnum.CREATED })
	status: OrderStatusEnum;

	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.orders)
	place: PlaceEntity;

	@Field(() => Float, { nullable: true })
	@Column("real", { nullable: true })
	totalPrice?: string;

	@Field(() => [ProductToOrderEntity], { nullable: true })
	@OneToMany(() => ProductToOrderEntity, (pTo) => pTo.order, { nullable: true, cascade: true })
	productsToOrders?: ProductToOrderEntity[];

	@Field(() => [UserEntity], { nullable: true })
	@ManyToMany(() => UserEntity, { cascade: true, nullable: true })
	@JoinTable()
	waiters?: UserEntity[];

	@Field(() => Date)
	@Column()
	createdAt: Date;

	@Field(() => Date)
	@Column()
	startDate: Date;

	@Field(() => String, { nullable: true })
	@Column({ nullable: true })
	comments?: string;
}

@ObjectType()
export class PaginatedActiveOrder extends Pagination(ActiveOrderEntity) {}

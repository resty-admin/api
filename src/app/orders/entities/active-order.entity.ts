import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, Generated, ManyToMany, ManyToOne } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { BaseEntity, IsNotEmpty, IsNumber } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { OrderStatusEnum, OrderTypeEnum } from "../../shared/enums";
import { ActiveShiftEntity } from "../../shifts/entities";
import { TableEntity } from "../../tables/entities";
import { UserEntity } from "../../users/entities";
import { ACTIVE_ORDERS } from "../constant";

@ObjectType()
@InputType("ActiveOrderEntityInput")
@Entity({ name: ACTIVE_ORDERS })
export class ActiveOrderEntity extends BaseEntity {
	// @ApiProperty()
	@Generated("increment")
	@Column("int", { unique: true })
	@Field(() => String)
	orderCode: number;

	// @ApiProperty()
	@Field(() => TableEntity)
	@ManyToOne(() => TableEntity, (table) => table.orders, { nullable: true })
	table?: TableEntity;

	// @ApiProperty()
	@Field(() => [UserEntity])
	@ManyToMany(() => UserEntity, (user) => user.orders, { nullable: true })
	users?: UserEntity[];

	// @ApiProperty()
	@Field(() => OrderTypeEnum)
	@Column("enum", { enum: OrderTypeEnum })
	type: OrderTypeEnum;

	// @ApiProperty()
	@Field(() => OrderStatusEnum)
	@Column("enum", { enum: OrderStatusEnum, default: OrderStatusEnum.OPENED })
	status: OrderStatusEnum;

	// @ApiProperty()
	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.orders)
	place: PlaceEntity;

	@Field(() => Int)
	@Column("int")
	@IsNumber()
	@IsNotEmpty()
	totalPrice: number;

	// @ApiProperty()
	@Field(() => ActiveShiftEntity, { nullable: true })
	@ManyToOne(() => ActiveShiftEntity, (shift) => shift.orders, { nullable: true })
	shift?: ActiveShiftEntity;
}

@ObjectType()
export class PaginatedActiveOrder extends Pagination(ActiveOrderEntity) {}

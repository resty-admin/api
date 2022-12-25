import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, Generated, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared";
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
	@ManyToOne(() => TableEntity, (table) => table.orders)
	table: TableEntity;

	// @ApiProperty()
	@Field(() => [UserEntity])
	@ManyToMany(() => UserEntity, (user) => user.orders)
	users: UserEntity[];

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
	@OneToMany(() => PlaceEntity, (place) => place.orders)
	place: PlaceEntity;

	// @ApiProperty()
	@Field(() => ActiveShiftEntity, { nullable: true })
	@ManyToOne(() => ActiveShiftEntity, (shift) => shift.orders)
	shift: ActiveOrderEntity;
}

@ObjectType()
export class PaginatedActiveOrder extends Pagination(ActiveOrderEntity) {}

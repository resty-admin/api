import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

import { ActiveOrderEntity } from "../../orders/entities";
import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { TableEntity } from "../../tables/entities";
import { UserEntity } from "../../users/entities";
import { ACTIVE_SHIFTS } from "../constants";

@ObjectType()
@Entity({ name: ACTIVE_SHIFTS })
export class ActiveShiftEntity extends BaseEntity {
	// @ApiProperty()
	@Field(() => UserEntity, { nullable: true })
	@OneToOne(() => UserEntity, { cascade: true, eager: true, nullable: true, createForeignKeyConstraints: false })
	@JoinColumn()
	waiter?: UserEntity;

	// @ApiProperty()
	@Field(() => TableEntity, { nullable: true })
	@OneToOne(() => TableEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	table?: TableEntity;

	// @ApiProperty()
	@Field(() => PlaceEntity, { nullable: true })
	@OneToOne(() => PlaceEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	place?: PlaceEntity;

	// @ApiProperty()
	@Field(() => [ActiveOrderEntity], { nullable: true })
	@OneToMany(() => ActiveOrderEntity, (order) => order.shift, { nullable: true })
	orders: ActiveOrderEntity;

	// @ApiProperty()
	@Field(() => String)
	@Column()
	shiftDate: String;
}

@ObjectType()
export class PaginatedActiveShift extends Pagination(ActiveShiftEntity) {}

import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { TableEntity } from "../../tables/entities";
import { UserEntity } from "../../users/entities";
import { ACTIVE_SHIFTS } from "../constants";

@ObjectType()
@InputType("ActiveShiftEntityInput")
@Entity({ name: ACTIVE_SHIFTS })
export class ActiveShiftEntity extends BaseEntity {
	@Field(() => UserEntity, { nullable: true })
	@OneToOne(() => UserEntity, { cascade: true, eager: true, nullable: true, createForeignKeyConstraints: false })
	@JoinColumn()
	waiter?: UserEntity;

	@Field(() => [TableEntity], { nullable: true })
	@ManyToMany(() => TableEntity, { cascade: true, nullable: true })
	@JoinTable()
	tables?: TableEntity;

	@Field(() => PlaceEntity, { nullable: true })
	@ManyToOne(() => PlaceEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	place?: PlaceEntity;

	@Field(() => Date)
	@Column()
	@CreateDateColumn()
	shiftDate: Date;
}

@ObjectType()
export class PaginatedActiveShift extends Pagination(ActiveShiftEntity) {}

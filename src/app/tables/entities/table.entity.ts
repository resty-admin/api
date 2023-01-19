import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { FileEntity } from "../../files/entities";
import { HallEntity } from "../../halls/entities";
import { ActiveOrderEntity } from "../../orders/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { TABLES } from "../constant";

@ObjectType()
@InputType("TableEntityInput")
@Entity({ name: TABLES })
export class TableEntity extends BaseEntity {
	@Column()
	@Field(() => String)
	name: string;

	@Column("int")
	@Field(() => Int)
	code: number;

	@Field(() => HallEntity)
	@ManyToOne(() => HallEntity, (hall) => hall.tables, { onDelete: "CASCADE" })
	hall: HallEntity;

	@Field(() => [ActiveOrderEntity], { nullable: true })
	@OneToMany(() => ActiveOrderEntity, (order) => order.table, { cascade: true, nullable: true })
	orders?: ActiveOrderEntity[];

	@Field(() => FileEntity, { nullable: true })
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	file?: FileEntity;

	@Field(() => Boolean)
	@Column("boolean", { default: false })
	isHide: boolean;
}

@ObjectType()
export class PaginatedTable extends Pagination(TableEntity) {}

import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { FileEntity } from "../../files/entities";
import { HallEntity } from "../../halls/entities";
import { ActiveOrderEntity } from "../../orders/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { TABLES } from "../constant";

@ObjectType()
@Entity({ name: TABLES })
export class TableEntity extends BaseEntity {
	@Column()
	// @ApiProperty()
	@Field(() => String)
	name: string;

	// @ApiProperty()
	@Generated("increment")
	@Column("int", { unique: true })
	@Field(() => Int)
	code: number;

	// @ApiProperty()
	@Field(() => HallEntity)
	@ManyToOne(() => HallEntity, (hall) => hall.tables)
	hall: HallEntity;

	// @ApiProperty()
	@Field(() => [ActiveOrderEntity], { nullable: true })
	@OneToMany(() => ActiveOrderEntity, (order) => order.table, { cascade: true, nullable: true })
	orders?: ActiveOrderEntity[];

	// @ApiProperty()
	@Field(() => FileEntity)
	@OneToOne(() => FileEntity, { cascade: true, eager: true })
	@JoinColumn()
	file: FileEntity;
}

@ObjectType()
export class PaginatedTable extends Pagination(TableEntity) {}

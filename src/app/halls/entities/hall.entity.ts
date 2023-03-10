import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { FileEntity } from "../../files/entities";
import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { IFile } from "../../shared/interfaces";
import { TableEntity } from "../../tables/entities";
import { HALLS } from "../constant";

@ObjectType()
@InputType("HallEntityInput")
@Entity({ name: HALLS })
export class HallEntity extends BaseEntity {
	@Column()
	@Field(() => String)
	name: string;

	@ManyToOne(() => PlaceEntity, (place) => place.halls, { cascade: true, onDelete: "CASCADE" })
	@Field(() => PlaceEntity)
	place: PlaceEntity;

	@Field(() => FileEntity, { nullable: true })
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	file?: IFile;

	@Field(() => [TableEntity], { nullable: true })
	@OneToMany(() => TableEntity, (table) => table.hall, { nullable: true })
	tables?: TableEntity[];

	@Field(() => Boolean)
	@Column("boolean", { default: false })
	isHide: boolean;

	@Field(() => GraphQLJSONObject, { nullable: true })
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	accountingSystemsFields?: object;

	@Column("int", { default: 0 })
	@Field(() => Int)
	orderNumber: number;
}

@ObjectType()
export class PaginatedHall extends Pagination(HallEntity) {}

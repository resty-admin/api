import { Field, InputType, ObjectType } from "@nestjs/graphql";
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
	// @ApiProperty()
	@Field(() => String)
	name: string;

	@ManyToOne(() => PlaceEntity, (place) => place.halls, { cascade: true })
	@Field(() => PlaceEntity)
		// @ApiProperty()
	place: PlaceEntity;

	// @ApiProperty()
	@Field(() => FileEntity, { nullable: true })
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	file?: IFile;

	// @ApiProperty()
	@Field(() => [TableEntity], { nullable: true })
	@OneToMany(() => TableEntity, (table) => table.hall, { nullable: true })
	tables?: TableEntity[];
}

@ObjectType()
export class PaginatedHall extends Pagination(HallEntity) {}

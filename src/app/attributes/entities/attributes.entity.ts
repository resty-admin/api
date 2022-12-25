import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany } from "typeorm";

import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { ATTRIBUTES } from "../constant";
import { AttributesGroupEntity } from "./attributes-group.entity";

@ObjectType()
@Entity({ name: ATTRIBUTES })
export class AttributesEntity extends BaseEntity {
	@Column()
	// @ApiProperty()
	@Field(() => String)
	name: string;

	// @ApiProperty()
	@Field(() => AttributesGroupEntity, { nullable: true })
	@OneToMany(() => AttributesGroupEntity, (attrGroup) => attrGroup.attributes, { nullable: true })
	attributesGroup?: AttributesGroupEntity;

	// @ApiProperty()
	@Field(() => Int, { nullable: true })
	@Column({ nullable: true })
	price?: number;
}

@ObjectType()
export class PaginatedAttributes extends Pagination(AttributesEntity) {}

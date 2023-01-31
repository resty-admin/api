import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToMany } from "typeorm";

import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { ATTRIBUTES } from "../constant";
import { AttributesGroupEntity } from "./attributes-group.entity";

@ObjectType()
@InputType("AttributesEntityInput")
@Entity({ name: ATTRIBUTES })
export class AttributesEntity extends BaseEntity {
	@Column()
	@Field(() => String)
	name: string;

	@Field(() => [AttributesGroupEntity])
	@ManyToMany(() => AttributesGroupEntity, (attrGroup) => attrGroup.attributes, { onDelete: "CASCADE" })
	attributesGroup: AttributesGroupEntity[];

	@Field(() => Int)
	@Column({ nullable: true })
	price: number;
}

@ObjectType()
export class PaginatedAttributes extends Pagination(AttributesEntity) {}

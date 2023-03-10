import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";

import { PlaceEntity } from "../../places/entities";
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

	@Field(() => [AttributesGroupEntity], { nullable: true })
	@ManyToMany(() => AttributesGroupEntity, (attrGroup) => attrGroup.attributes, {
		nullable: true,
		onUpdate: "CASCADE",
		onDelete: "CASCADE"
	})
	attributesGroup?: AttributesGroupEntity[];

	@Field(() => PlaceEntity, { nullable: true })
	@ManyToOne(() => PlaceEntity, { nullable: true })
	place: PlaceEntity;

	@Field(() => Int)
	@Column({ nullable: true })
	price: number;

	@Field(() => GraphQLJSONObject, { nullable: true })
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	accountingSystemsFields?: object;
}

@ObjectType()
export class PaginatedAttributes extends Pagination(AttributesEntity) {}

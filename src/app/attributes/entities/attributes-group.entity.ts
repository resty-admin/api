import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { ProductEntity } from "../../products/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { AttributeGroupTypeEnum } from "../../shared/enums";
import { ATTRIBUTE_GROUPS } from "../constant";
import { AttributesEntity } from "./attributes.entity";

@ObjectType()
@InputType("AttributesGroupEntityInput")
@Entity({ name: ATTRIBUTE_GROUPS })
export class AttributesGroupEntity extends BaseEntity {
	@Column()
	@Field(() => String)
	name: string;

	@Field(() => [AttributesEntity], { nullable: true })
	@ManyToMany(() => AttributesEntity, (attr) => attr.attributesGroup, { nullable: true, onDelete: "CASCADE" })
	@JoinTable()
	attributes?: AttributesEntity[];

	@Field(() => [ProductEntity], { nullable: true })
	@ManyToMany(() => ProductEntity, (product) => product.attrsGroups, { nullable: true, onDelete: "CASCADE" })
	products?: ProductEntity[];

	@ManyToOne(() => PlaceEntity, (place) => place.attrGroups, { cascade: true })
	@Field(() => PlaceEntity)
	place: PlaceEntity;

	@Field(() => AttributeGroupTypeEnum)
	@Column("enum", { enum: AttributeGroupTypeEnum, default: AttributeGroupTypeEnum.ADD })
	type: AttributeGroupTypeEnum;

	@Field(() => Int)
	@Column({ default: 5 })
	maxItemsForPick: number;

	@Field(() => GraphQLJSONObject, { nullable: true })
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	accountingSystemsFields?: object;
}

@ObjectType()
export class PaginatedAttributeGroups extends Pagination(AttributesGroupEntity) {}

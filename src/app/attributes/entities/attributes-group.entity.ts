import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
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
	// @ApiProperty()
	@Field(() => String)
	name: string;

	// @ApiProperty()
	@Field(() => [AttributesEntity], { nullable: true })
	@ManyToMany(() => AttributesEntity, (attr) => attr.attributesGroup, { nullable: true, onDelete: "CASCADE" })
	@JoinTable()
	attributes?: AttributesEntity[];

	// @ApiProperty()
	@Field(() => [ProductEntity], { nullable: true })
	@ManyToMany(() => ProductEntity, (product) => product.attrsGroups, { nullable: true })
	products?: ProductEntity[];

	@ManyToOne(() => PlaceEntity, (place) => place.attrGroups, { cascade: true })
	@Field(() => PlaceEntity)
	// @ApiProperty()
	place: PlaceEntity;

	@Field(() => AttributeGroupTypeEnum)
	@Column("enum", { enum: AttributeGroupTypeEnum, default: AttributeGroupTypeEnum.ADD })
	type: AttributeGroupTypeEnum;

	@Field(() => Int)
	@Column({ default: 5 })
	maxItemsForPick: number;
}

@ObjectType()
export class PaginatedAttributeGroups extends Pagination(AttributesGroupEntity) {}

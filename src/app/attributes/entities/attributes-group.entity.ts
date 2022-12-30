import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { ProductEntity } from "../../products/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
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

	@Column()
	// @ApiProperty()
	@Field(() => Boolean, { defaultValue: false, nullable: true })
	isUniq: boolean;

	// @ApiProperty()
	@Field(() => [AttributesEntity], { nullable: true })
	@OneToMany(() => AttributesEntity, (attr) => attr.attributesGroup, { cascade: true, nullable: true })
	attributes?: AttributesEntity[];

	// @ApiProperty()
	@Field(() => [ProductEntity], { nullable: true })
	@ManyToMany(() => ProductEntity, (product) => product.attrsGroups, { nullable: true })
	products?: ProductEntity[];

	@ManyToOne(() => PlaceEntity, (place) => place.attrGroups, { cascade: true })
	@Field(() => PlaceEntity)
	// @ApiProperty()
	place: PlaceEntity;
}

@ObjectType()
export class PaginatedAttributeGroups extends Pagination(AttributesGroupEntity) {}

import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { FileEntity } from "../../files/entities";
import { PlaceEntity } from "../../places/entities";
import { ProductEntity } from "../../products/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { IFile } from "../../shared/interfaces";
import { CATEGORIES } from "../constants";

@ObjectType()
@InputType("CategoryEntityInput")
@Entity({ name: CATEGORIES })
export class CategoryEntity extends BaseEntity {
	@Field(() => String)
	@Column({ default: "" })
	name: string;

	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.categories, { onDelete: "CASCADE" })
	place: PlaceEntity;

	@Field(() => [ProductEntity], { nullable: true })
	@OneToMany(() => ProductEntity, (product) => product.category, { nullable: true })
	products?: ProductEntity[];

	@Field(() => FileEntity, { nullable: true })
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	file?: IFile;

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
export class PaginatedCategory extends Pagination(CategoryEntity) {}

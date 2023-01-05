import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
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
	@ApiProperty()
	name: string;

	@ApiProperty()
	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.categories)
	place: PlaceEntity;

	@ApiProperty()
	@Field(() => [ProductEntity], { nullable: true })
	@OneToMany(() => ProductEntity, (product) => product.category, { nullable: true })
	products?: ProductEntity[];

	@ApiProperty()
	@Field(() => FileEntity, { nullable: true })
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	file?: IFile;

	@Field(() => Boolean)
	@Column("boolean", { default: false })
	isHide: boolean;

	// @OneToMany(() => ProductEntity, (product) => product.category)
	// products: IProduct[];
}

@ObjectType()
export class PaginatedCategory extends Pagination(CategoryEntity) {}

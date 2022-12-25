import { Field, ObjectType } from "@nestjs/graphql";
import { IFile } from "src/app/shared/interfaces";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { FileEntity } from "../../files/entities";
import { PlaceEntity } from "../../places/entities";
import { ProductEntity } from "../../products/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { CATEGORIES } from "../constants";

@ObjectType()
@Entity({ name: CATEGORIES })
export class CategoryEntity extends BaseEntity {
	@Field(() => String)
	@Column({ default: "" })
	// @ApiProperty()
	name: string;

	// @ApiProperty()
	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.categories)
	place: PlaceEntity;

	// @ApiProperty()
	@Field(() => [ProductEntity])
	@OneToMany(() => ProductEntity, (product) => product.category, { nullable: true })
	products?: ProductEntity[];

	// @ApiProperty()
	@Field(() => FileEntity, { nullable: true })
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	file?: IFile;

	// @OneToMany(() => ProductEntity, (product) => product.category)
	// products: IProduct[];
}

@ObjectType()
export class PaginatedCategory extends Pagination(CategoryEntity) {}

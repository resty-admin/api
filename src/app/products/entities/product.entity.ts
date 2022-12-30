import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne } from "typeorm";

import { AttributesGroupEntity } from "../../attributes/entities";
import { CategoryEntity } from "../../categories/entities";
import { FileEntity } from "../../files/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { IFile } from "../../shared/interfaces";
import { PRODUCTS } from "../constant";

@ObjectType()
@InputType("ProductEntityInput")
@Entity({ name: PRODUCTS })
export class ProductEntity extends BaseEntity {
	@Column()
	// @ApiProperty()
	@Field(() => String)
	name: string;

	// @ApiProperty()
	// @Field(() => String)
	// @Column()
	// slug: string;

	// @BeforeInsert()
	// private updateSlug() {
	// 	const cyrillicToTranslit = new (CyrillicToTranslit as any)();
	// 	this.slug = cyrillicToTranslit.transform(this.name, "_").toLowerCase();
	// }

	// @ApiProperty()
	@Field(() => CategoryEntity)
	@ManyToOne(() => CategoryEntity, (category) => category.products, { cascade: true })
	category: CategoryEntity;

	// @ApiProperty()
	@Field(() => String, { nullable: true })
	@IsOptional()
	@Column({ default: "", nullable: true })
	description?: string;

	// @ApiProperty()
	@Field(() => Int)
	@Column({ default: 0 })
	price: number;

	@ApiProperty()
	@Field(() => FileEntity, { nullable: true })
	@IsOptional()
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	file?: IFile;

	@ApiProperty()
	@Field(() => [AttributesGroupEntity], { nullable: true })
	@IsOptional()
	@ManyToMany(() => AttributesGroupEntity, (attrGroup) => attrGroup.products, { nullable: true })
	@IsOptional()
	attrsGroups?: AttributesGroupEntity[];
}

@ObjectType()
export class PaginatedProduct extends Pagination(ProductEntity) {}

import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from "typeorm";

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
	@Field(() => String)
	name: string;

	@Field(() => CategoryEntity)
	@ManyToOne(() => CategoryEntity, (category) => category.products, {
		cascade: true,
		onDelete: "CASCADE"
	})
	category: CategoryEntity;

	@Field(() => String, { nullable: true })
	@Column({ default: "", nullable: true })
	description?: string;

	@Field(() => Int)
	@Column({ default: 0 })
	price: number;

	@ApiProperty()
	@Field(() => FileEntity, { nullable: true })
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	file?: IFile;

	@ApiProperty()
	@Field(() => [AttributesGroupEntity], { nullable: true })
	@ManyToMany(() => AttributesGroupEntity, (attrGroup) => attrGroup.products, { nullable: true })
	@JoinTable()
	attrsGroups?: AttributesGroupEntity[];

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

	@Generated("increment")
	@Column("int", { unique: true })
	@Field(() => Int)
	orderNumber: number;
}

@ObjectType()
export class PaginatedProduct extends Pagination(ProductEntity) {}

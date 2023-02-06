import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";

import { AttributesEntity } from "../../attributes/entities";
import { BaseEntity } from "../../shared";
import { ProductToOrderEntity } from "./product-to-order.entity";

@ObjectType()
@InputType("AttributeToProductEntityInput")
@Entity({ name: "attribute-to-product" })
export class AttributeToProductEntity extends BaseEntity {
	@Field(() => AttributesEntity)
	@ManyToOne(() => AttributesEntity, { onDelete: "CASCADE" })
	attribute: AttributesEntity;

	@Field(() => ProductToOrderEntity)
	@ManyToOne(() => ProductToOrderEntity, { onDelete: "CASCADE" })
	productToOrder: ProductToOrderEntity;

	@Field(() => Int)
	@Column("int")
	count: number;
}

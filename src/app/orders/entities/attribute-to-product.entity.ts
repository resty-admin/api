import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";

import { AttributesEntity } from "../../attributes/entities";
import { BaseEntity } from "../../shared";

@ObjectType()
@InputType("AttributeToProductEntityInput")
@Entity({ name: "attribute-to-product" })
export class AttributeToProductEntity extends BaseEntity {
	@Field(() => AttributesEntity)
	@ManyToOne(() => AttributesEntity, { onDelete: "CASCADE" })
	attribute: AttributesEntity;

	@Field(() => Int)
	@Column("int")
	count: number;
}

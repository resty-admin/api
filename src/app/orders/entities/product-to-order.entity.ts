import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { ProductEntity } from "../../products/entities";
import { BaseEntity } from "../../shared";
import { ProductToOrderPaidStatusEnum, ProductToOrderStatusEnum } from "../../shared/enums";
import { UserEntity } from "../../users/entities";
import { ActiveOrderEntity } from "./active-order.entity";
import { AttributeToProductEntity } from "./attribute-to-product.entity";

@ObjectType()
@InputType("ProductToOrderEntityInput")
@Entity({ name: "product-to-order" })
export class ProductToOrderEntity extends BaseEntity {
	@Field(() => UserEntity)
	@ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
	user: UserEntity;

	@Field(() => ProductEntity)
	@ManyToOne(() => ProductEntity, { onDelete: "CASCADE" })
	product: ProductEntity;

	// @Field(() => [AttributesEntity], { nullable: true })
	// @ManyToMany(() => AttributesEntity, { nullable: true, onDelete: "CASCADE" })
	// @JoinTable()
	// attributes?: AttributesEntity[];

	@Field(() => [AttributeToProductEntity], { nullable: true })
	@OneToMany(() => AttributeToProductEntity, (aTo) => aTo.productToOrder, { nullable: true, cascade: true })
	attributesToProduct?: AttributeToProductEntity[];

	@Field(() => ActiveOrderEntity)
	@ManyToOne(() => ActiveOrderEntity, (order) => order.productsToOrders, { onDelete: "CASCADE" })
	order: ActiveOrderEntity;

	@Field(() => Int)
	@Column()
	count: number;

	@Field(() => ProductToOrderStatusEnum)
	@Column("enum", { enum: ProductToOrderStatusEnum, default: ProductToOrderStatusEnum.WAITING_FOR_APPROVE })
	status: ProductToOrderStatusEnum;

	@Field(() => ProductToOrderPaidStatusEnum)
	@Column("enum", { enum: ProductToOrderPaidStatusEnum, default: ProductToOrderPaidStatusEnum.NOT_PAID })
	paidStatus: ProductToOrderPaidStatusEnum;
}

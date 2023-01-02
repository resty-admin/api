import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

import { AttributesEntity } from "../../attributes/entities";
import { ProductEntity } from "../../products/entities";
import { BaseEntity } from "../../shared";
import { UserEntity } from "../../users/entities";
import { ActiveOrderEntity } from "./active-order.entity";

@ObjectType()
@InputType("UserToOrderEntityInput")
@Entity({ name: "user-to-order" })
export class UserToOrderEntity extends BaseEntity {
	@Field(() => UserEntity)
	@ManyToOne(() => UserEntity)
	user: UserEntity;

	@Field(() => ProductEntity)
	@ManyToOne(() => ProductEntity)
	product: ProductEntity;

	@Field(() => [AttributesEntity], { nullable: true })
	@ManyToMany(() => AttributesEntity, { nullable: true })
	@JoinTable()
	attributes?: AttributesEntity[];

	@Field(() => ActiveOrderEntity)
	@ManyToOne(() => ActiveOrderEntity, (order) => order.usersToOrders)
	order: ActiveOrderEntity;

	// @Field(() => String)
	// @Column()
	// orderId: string;

	@Field(() => Int)
	@Column()
	count: number;
}

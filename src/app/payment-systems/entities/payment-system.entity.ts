import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { PAYMENT_SYSTEMS } from "../constant";

@ObjectType()
@InputType("PaymentSystemEntityInput")
@Entity({ name: PAYMENT_SYSTEMS })
export class PaymentSystemEntity extends BaseEntity {
	// @ApiProperty()
	@Field(() => String)
	@Column()
	name: string;
}

@ObjectType()
export class PaginatedPaymentSystem extends Pagination(PaymentSystemEntity) {}

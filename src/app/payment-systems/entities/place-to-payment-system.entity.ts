import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, ManyToOne } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared";
import { PaymentSystemEntity } from "./payment-system.entity";

@ObjectType()
@InputType("PlaceToPaymentSystemEntityInput")
@Entity({ name: "place-to-payment-system" })
export class PlaceToPaymentSystemEntity extends BaseEntity {
	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.paymentSystems)
	place: PlaceEntity;

	@Field(() => PaymentSystemEntity)
	@ManyToOne(() => PaymentSystemEntity)
	paymentSystem: PaymentSystemEntity;

	@Field(() => GraphQLJSONObject, { nullable: true })
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	placeConfigFields?: object;
}

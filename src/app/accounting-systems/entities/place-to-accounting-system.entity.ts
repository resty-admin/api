import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity, ManyToOne } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared";
import { AccountingSystemEntity } from "./accounting-system.entity";

@ObjectType()
@InputType("PlaceAccountingSystemEntityInput")
@Entity({ name: "place-to-accounting-system" })
export class PlaceToAccountingSystemEntity extends BaseEntity {
	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.accountingSystems)
	place: PlaceEntity;

	@Field(() => AccountingSystemEntity)
	@ManyToOne(() => AccountingSystemEntity)
	accountingSystem: AccountingSystemEntity;

	@Field(() => GraphQLJSONObject, { nullable: true })
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	placeConfigFields?: object;
}

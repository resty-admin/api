import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity as _BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
export class BaseEntity extends _BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	@Field(() => String)
	id: string;
}

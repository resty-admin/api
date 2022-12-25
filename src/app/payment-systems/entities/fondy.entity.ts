import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToOne } from "typeorm";

import { CompanyEntity } from "../../companies/entities";
import { BaseEntity } from "../../shared";
import { FONDY } from "../constant";

@ObjectType()
@Entity({ name: FONDY })
export class FondyEntity extends BaseEntity {
	// @ApiProperty()
	@Field(() => String)
	@Column()
	merchantId: string;

	// @ApiProperty()
	@Field(() => String)
	@Column()
	secretKey: string;

	// @ApiProperty()
	@Field(() => CompanyEntity)
	@OneToOne(() => CompanyEntity, (company) => company.fondy)
	company: CompanyEntity;
}

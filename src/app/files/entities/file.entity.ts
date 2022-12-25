import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../shared";
import { FILES } from "../constant";

@Entity({ name: FILES })
@ObjectType()
export class FileEntity extends BaseEntity {
	@Column()
	// @ApiProperty()
	@Field(() => String)
	url: string;
}

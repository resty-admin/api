import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../shared";
import { FILES } from "../constant";

@Entity({ name: FILES })
@ObjectType()
@InputType("FileEntityInput")
export class FileEntity extends BaseEntity {
	@Column()
	// @ApiProperty()
	@Field(() => String)
	url: string;
}

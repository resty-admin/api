import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { FileEntity } from "../../files/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { LANGUAGES } from "../constants";

@ObjectType()
@Entity({ name: LANGUAGES })
export class LanguageEntity extends BaseEntity {
	// @ApiProperty()
	@Field(() => String)
	@Column({ default: "" })
	name: string;

	// @ApiProperty()
	@Field(() => FileEntity)
	@OneToOne(() => FileEntity, { cascade: true, eager: true })
	@JoinColumn()
	file: FileEntity;
}

@ObjectType()
export class PaginatedLanguage extends Pagination(LanguageEntity) {}

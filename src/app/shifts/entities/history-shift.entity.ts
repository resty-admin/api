import { ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity } from "typeorm";

import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import type { ITable } from "../../shared/interfaces";
import { IPlace, IUser } from "../../shared/interfaces";
import { HISTORY_SHIFTS } from "../constants";

@Entity({ name: HISTORY_SHIFTS })
export class HistoryShiftEntity extends BaseEntity {
	// @Column({
	// 	type: "json",
	// 	default: () => `('${JSON.stringify({})}')`,
	// 	nullable: true
	// })
	// table?: string;
	//
	// @Column({
	// 	type: "jsonb",
	// 	array: false,
	// 	default: () => "'[]'",
	// 	nullable: true
	// })
	// users: IUser[];

	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	waiter?: IUser;

	@Column({
		type: "jsonb",
		array: false,
		default: () => "'[]'",
		nullable: true
	})
	tables?: ITable[];

	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	place?: IPlace;

	@Column()
	shiftDateStart: Date;

	@Column()
	@CreateDateColumn()
	shiftDateEnd: Date;
}

@ObjectType()
export class PaginatedHistoryShift extends Pagination(HistoryShiftEntity) {}

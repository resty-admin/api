import type { Type } from "@nestjs/common";
import { Field, Int, ObjectType } from "@nestjs/graphql";

export interface IPaginatedType<T> {
	data: T[];
	page: number;
	totalCount: number;
}

export function Pagination<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
	@ObjectType({ isAbstract: true })
	abstract class PaginatedType implements IPaginatedType<T> {
		@Field(() => [classRef], { nullable: true })
		data: T[];

		@Field(() => Int)
		page: number;

		@Field(() => Int)
		totalCount: number;
	}

	return PaginatedType as Type<IPaginatedType<T>>;
}

import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StatisticType {
	@Field(() => Int)
	guests: number;

	@Field(() => Int)
	employees: number;

	@Field(() => Int)
	halls: number;

	@Field(() => Int)
	tables: number;

	@Field(() => Int)
	totalAmount: number;

	@Field(() => Int)
	tax: number;
}

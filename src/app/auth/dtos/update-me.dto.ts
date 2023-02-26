import { Field, InputType } from "@nestjs/graphql";

import { IsOptional } from "../../shared";
import { UserRoleEnum } from "../../shared/enums";

@InputType()
export class UpdateMeInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	name?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	email?: string;

	@Field(() => UserRoleEnum, { nullable: true })
	@IsOptional()
	role?: UserRoleEnum;

	@Field(() => String, { nullable: true })
	@IsOptional()
	tel?: string;
}

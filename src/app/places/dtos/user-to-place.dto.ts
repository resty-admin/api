import { Field, InputType } from "@nestjs/graphql";

import { IsEnum, IsNotEmpty, IsString } from "../../shared";
import { UserRoleEnum } from "../../shared/enums";

@InputType()
export class UserToPlaceInput {
	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	user: string;

	@Field(() => String)
	@IsNotEmpty()
	@IsString()
	place: string;

	@Field(() => UserRoleEnum)
	@IsNotEmpty()
	@IsEnum(UserRoleEnum)
	role: UserRoleEnum;
}

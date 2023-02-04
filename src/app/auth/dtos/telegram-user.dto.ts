import { Field, ID, InputType } from "@nestjs/graphql";

// import GraphQLLong from 'graphql-type-long';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "../../shared";
import { UserRoleEnum } from "../../shared/enums";
import type { ITelegramUser } from "../../shared/interfaces";

@InputType()
export class TelegramUserInput implements ITelegramUser {
	@Field(() => ID)
	@IsNotEmpty()
	id: number;

	@Field(() => Boolean, { nullable: true })
	@IsOptional()
	is_bot: boolean;

	@Field(() => String)
	@IsString()
	first_name: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	username?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	last_name?: string;

	@Field(() => Boolean, { nullable: true })
	@IsOptional()
	is_premium?: true;

	@Field(() => String, { nullable: true })
	@IsOptional()
	language_code?: string;

	@Field(() => Boolean, { nullable: true })
	@IsOptional()
	added_to_attachment_menu?: true;

	@Field(() => UserRoleEnum)
	@IsEnum(UserRoleEnum)
	role: UserRoleEnum;
}

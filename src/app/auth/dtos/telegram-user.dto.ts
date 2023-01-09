import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean } from "class-validator";

import { IsOptional, IsString } from "../../shared";
import type { ITelegramUser } from "../../shared/interfaces";

@InputType()
export class TelegramUserInput implements ITelegramUser {
	@Field(() => String)
	@IsString()
	id: number;

	@Field(() => Boolean)
	@IsBoolean()
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
}

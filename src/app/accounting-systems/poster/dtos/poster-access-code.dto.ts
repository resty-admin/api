import { Field, InputType } from "@nestjs/graphql";

import { IsNotEmpty, IsString } from "../../../shared";

@InputType()
export class PosterAccessCodeInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	code: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	login: string;

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	placeId: string;
}

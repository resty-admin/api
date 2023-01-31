import { Field, InputType } from "@nestjs/graphql";

export class FileUploadDto {
	// @ApiProperty({ type: "string", format: "binary" })
	file: Express.Multer.File;
}

@InputType()
export class FileUploadInput {
	@Field(() => String)
	id: string;

	@Field(() => String)
	url: string;
}

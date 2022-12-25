import { FileEntity } from "../../files/entities";
import { IsNotEmpty, IsString } from "../../shared";

export class CreateLanguageDto {
	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsString()
	@IsNotEmpty()
	// @ApiProperty()
	file: FileEntity;
}

import { FileEntity } from "../../files/entities";
import { IsNotEmpty, IsOptional, IsString } from "../../shared";

export class UpdateLanguageDto {
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	// @ApiProperty()
	name: string;

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	// @ApiProperty()
	file: FileEntity;
}

import { IsCryptedLength, IsNotEmpty, IsString } from "../../shared";

export class ResetPasswordDto {
	@IsString()
	@IsNotEmpty()
	@IsCryptedLength(5)
	password: string;
}

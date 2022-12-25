import type { IVerifyCode } from "src/app/shared/interfaces";

import { IsNotEmpty, IsNumber } from "../../shared";

export class VerifyCodeDto implements IVerifyCode {
	@IsNumber()
	@IsNotEmpty()
	verificationCode: number;
}

import { ClassSerializerInterceptor } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

export const CORE_INTERCEPTORS = [
	{
		provide: APP_INTERCEPTOR,
		useClass: ClassSerializerInterceptor
	}
];

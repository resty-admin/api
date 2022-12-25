import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Catch, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { isArray } from "lodash";

@Catch()
export class ErrorsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: any, host: ArgumentsHost): void {
		console.error(exception);

		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();

		const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		const { statusCode, message } = exception.response || { statusCode: 500, message: exception };

		const responseBody = {
			statusCode,
			messages: isArray(message) ? message : [message.toString()]
		};

		try {
			httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
		} catch (error) {
			console.log("error", error);
		}
	}
}

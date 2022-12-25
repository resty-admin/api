import { APP_FILTER } from "@nestjs/core";

import { ErrorsFilter } from "./errors/errors.filter";

export const CORE_FILTERS = [
	{
		provide: APP_FILTER,
		useClass: ErrorsFilter
	}
];

export * from "./errors/errors.filter";

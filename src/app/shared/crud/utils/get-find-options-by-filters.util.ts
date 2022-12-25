import { isArray, set } from "lodash";
import type { FindManyOptions } from "typeorm";
import { In } from "typeorm";

import { SortTypeEnum } from "../enums";
import { getNumberOrString } from "./get-number-or-string.util";

export function getFindOptionsByFilters(filters: any[]): FindManyOptions {
	const {
		skip = 0,
		take = 0,
		sortBy,
		sortType,
		...where
	} = filters.reduce(
		(previousValue: any, { key, value }) =>
			set(previousValue, key, isArray(value) ? In(value) : getNumberOrString(value)),
		{}
	);

	return {
		skip,
		take,
		where,
		order: {
			[sortBy || "createdAt"]: sortType || SortTypeEnum.ASC
		}
	};
}

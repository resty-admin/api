import { set } from "lodash";
import type { FindManyOptions } from "typeorm";
import { In } from "typeorm";

import { SortTypeEnum } from "../enums";
import { getNumberOrString } from "./get-number-or-string.util";

// return {
// 	key: isArray ? key.replace("[]", "") : key,
// 	operator,
// 	value: isArray ? [value] : value.includes(",") ? value.split(",") : Like(`%${value}%`)
// };

// [
// 	{
// 		key: "",
// 		operator: "",
// 		value: ""
// 	}
// ]
export function getFindOptionsByFilters(filters: any[] = []): FindManyOptions {
	const {
		skip = 0,
		take = 0,
		sortBy,
		sortType,
		...where
	} = filters.reduce(
		(previousValue: any, { key, operator, value }) =>
			set(previousValue, key, operator === "=[]" ? In(value.split(".")) : getNumberOrString(value)),
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

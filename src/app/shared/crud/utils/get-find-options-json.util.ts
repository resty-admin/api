export interface Filter {
	key: string;
	operator: string;
	value: string;
}

export const getFindOptionsJsonUtil = (filters: Filter[], queryBuilder: any, fieldName: string) => {
	if (!filters || filters.length === 0) {
		return queryBuilder;
	}

	const jsonFilters = filters.reduce((pre, { key, operator, value }) => {
		const fieldsKeys = key.split(".");
		const [rootKey] = fieldsKeys;

		const jsonValue =
			fieldsKeys.length === 0
				? { [rootKey]: value }
				: fieldsKeys.reduce((pre: any, curr, idx) => ({ [fieldsKeys[fieldsKeys.length - 1 - idx]]: pre }), value);

		return {
			...pre,
			[`${fieldName}.${rootKey} ${operator} :${rootKey}`]: jsonValue
		};
	}, {});

	let queryBuilderWithFilters = queryBuilder;

	for (const [key, val] of Object.entries(jsonFilters)) {
		const whereExist = queryBuilderWithFilters.expressionMap.wheres.length;
		queryBuilderWithFilters = queryBuilderWithFilters[whereExist ? "andWhere" : "where"](key, val);
	}

	return queryBuilderWithFilters;
};

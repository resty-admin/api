export function getNumberOrString(value: string) {
	const parsedValue = Number.parseInt(value);
	return parsedValue.toString().length === value.length ? parsedValue : value;
}

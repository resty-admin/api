export function removeFirstSlash(_string: string) {
	return _string.replaceAll(/^\/|\/$/g, "");
}

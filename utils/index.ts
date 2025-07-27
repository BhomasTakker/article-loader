export const mergeStringOrArray = (
	val1: string | string[] = [],
	val2: string | string[] = []
) => {
	const arrayVal1 = typeof val1 === "string" ? [val1] : val1;
	const arrayVal2 = typeof val2 === "string" ? [val2] : val2;
	return [...new Set([...arrayVal1, ...arrayVal2])];
};

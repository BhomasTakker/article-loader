export const toStringArray = (
	value: string | string[] | undefined,
): string[] => {
	if (!value) return [];
	if (Array.isArray(value)) return value;
	return value
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
};

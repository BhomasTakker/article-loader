export const cloneDeepSerializable = (obj: unknown) => {
	return JSON.parse(JSON.stringify(obj));
};

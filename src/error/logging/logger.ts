export const logError = (message: string, error: unknown) => {
	const errorMessage = error instanceof Error ? error.message : String(error);
	const errorType = error instanceof Error ? error.name : "Unknown";
	console.error(`${message} [${errorType}]: ${errorMessage}`);
};

const PYTHON_SERVICE_URL =
	process.env.PYTHON_SERVICE_URL ?? "http://localhost:8001";

export const pingPythonService = async (): Promise<unknown> => {
	const response = await fetch(`${PYTHON_SERVICE_URL}/ping`);
	if (!response.ok) {
		throw new Error(`Python service responded with ${response.status}`);
	}
	return response.json();
};

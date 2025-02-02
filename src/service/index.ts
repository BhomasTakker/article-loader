type ServiceState = "running" | "ready";

export const ServiceState = {
	running: "running",
	ready: "ready",
} as const;

export class Service {
	private static instance: Service;
	private state: ServiceState = "ready";

	// Private constructor to prevent direct instantiation
	private constructor() {}

	// Public method to provide access to the instance
	public static getInstance(): Service {
		if (!Service.instance) {
			Service.instance = new Service();
		}
		return Service.instance;
	}

	public getState(): ServiceState {
		return this.state;
	}

	public setState(state: ServiceState): void {
		// really should be only if acceptable value
		this.state = state;
	}
}

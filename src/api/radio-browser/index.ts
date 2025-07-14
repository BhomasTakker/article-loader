import { RadioBrowserApi } from "radio-browser-api";

const baseParameters = {
	limit: 100,
	hideBroken: true,
};

export class RadioBrowser {
	private api: RadioBrowserApi;

	constructor() {
		this.api = new RadioBrowserApi("Datatattat");
	}

	async searchStations(params: RadioBrowserAPISearchParams) {
		try {
			const stations = await this.api.searchStations({
				...baseParameters,
				...params,
			});

			return stations;
		} catch (error) {
			console.error("Error fetching radio stations:", error);
			throw error;
		}
	}

	async getStationsById(id: string) {
		try {
			const stations = await this.api.getStationsById([id]);
			return stations;
		} catch (error) {
			console.error("Error fetching radio station by ID:", error);
			throw error;
		}
	}
}

export type RadioBrowserAPISearchParams = {
	tag?: string;
	name?: string;
};
// Could instance it - and just allow static call of members
export const fetchNewsRadioStations = async (
	params: RadioBrowserAPISearchParams
) => {
	if (!params) {
		console.warn("No params provided for radio browser search");
		return Promise.resolve([]);
	}
	const radioBrowser = new RadioBrowser();
	return await radioBrowser.searchStations(params);
};

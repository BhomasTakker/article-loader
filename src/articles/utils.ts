// Utils and make better
export const convertDurationToSeconds = (duration: string) => {
	if (!duration) {
		return undefined;
	}
	// assuming that the durtion is given in seconds when it is a number
	if (!isNaN(Number(duration))) {
		return Number(duration);
	}
	// Assuming the duration is in the format "HH:MM:SS"
	const parts = duration.split(":").map(Number);
	let seconds = 0;

	if (parts.length === 3) {
		seconds += parts[0] * 3600; // Hours
		seconds += parts[1] * 60; // Minutes
		seconds += parts[2]; // Seconds
	} else if (parts.length === 2) {
		seconds += parts[0] * 60; // Minutes
		seconds += parts[1]; // Seconds
	} else if (parts.length === 1) {
		seconds += parts[0]; // Seconds
	}

	return seconds;
};

export const parseDate = (
	dateString: string | undefined,
): string | undefined => {
	if (!dateString) return undefined;

	const parsed = new Date(dateString);
	// Check if valid date
	if (!isNaN(parsed.getTime())) {
		return parsed.toISOString();
	}

	// If invalid, return undefined or current date
	return undefined;
};

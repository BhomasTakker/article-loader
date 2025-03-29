let highestRss = 0;

export const logMemoryUsage = () => {
	const formatMemoryUsage = (data: any) =>
		`${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

	const memoryData = process.memoryUsage();

	highestRss = Math.max(highestRss, memoryData.rss);

	const memoryUsage = {
		rss: `${formatMemoryUsage(
			memoryData.rss
		)} -> Resident Set Size - total memory allocated for the process execution`,
		heapTotal: `${formatMemoryUsage(
			memoryData.heapTotal
		)} -> total size of the allocated heap`,
		heapUsed: `${formatMemoryUsage(
			memoryData.heapUsed
		)} -> actual memory used during the execution`,
		external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
	};

	console.log(memoryUsage);
	console.log(`Highest RSS: ${formatMemoryUsage(highestRss)}}`);
};

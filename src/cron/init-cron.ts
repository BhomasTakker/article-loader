import { createCron } from "./create-cron";
import { CronConfig, CronJob, GenericCronConfig } from "./types";
import { createCronJobData } from "./create-cron-data";
import CronJobModel from "../models/CronJob";
import { connectToMongoDB } from "../lib/mongo/db";
import { CronTypeMap } from "./jobs";

// pass in config to use for cron
export const initCronJobs = (config: CronConfig) => {
	config.cron.forEach((job: CronJob) => {
		createCron({
			time: job.time,
			fetchFn: job.fetchFn,
			onComplete: job.onComplete,
		});
	});
};

const createCronJobsFromConfig = async (config: GenericCronConfig) => {
	const { cron, type } = config;
	const jobs = [];
	const createCronJob = CronTypeMap.get(type);

	for (const jobConfig of cron) {
		if (!createCronJob) {
			// should log warning
			// should return just data?
			// i.e. jobs.push await createCronJobData(jobConfig)
			continue;
		}

		const job = await createCronJob(jobConfig as any);
		jobs.push(await createCronJobData(job));
	}

	return {
		id: config.id,
		cron: jobs,
	};
};

export const initialiseCronJobs = async () => {
	await connectToMongoDB();

	// Fetch active cron jobs from database
	const cronJobs = await CronJobModel.find({ isActive: true });

	if (!cronJobs || cronJobs.length === 0) {
		console.warn("No active cron jobs found in database");
		return;
	}

	for (const cronJobDoc of cronJobs) {
		const config: GenericCronConfig = {
			id: cronJobDoc.id,
			type: cronJobDoc.type,
			cron: cronJobDoc.cron,
		};

		initCronJobs(await createCronJobsFromConfig(config));
		console.log(`Initialized cron job: ${cronJobDoc.id}`);
	}
};

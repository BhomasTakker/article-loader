import express from "express";
import { connectToMongoDB } from "./src/lib/mongo/db";
import { fetchRss } from "./src/rss/fetch-rss";
import { Service, ServiceState } from "./src/service";
import { COLLECTIONS } from "./sources/collections";
require("dotenv").config();

const port = process.env.PORT;

const app = express();

const startServer = async () => {
	await connectToMongoDB();

	const service = Service.getInstance();
	const state = service.getState();

	if (state === ServiceState.ready) {
		service.setState(ServiceState.running);
		fetchRss(COLLECTIONS, () => service.setState(ServiceState.ready));
	}
};

startServer();

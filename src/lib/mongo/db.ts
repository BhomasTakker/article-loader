// https://medium.com/@elhamrani.omar23/next-js-14-server-actions-with-typescript-mongodb-mongoose-4a11575b987c
// Importing mongoose library along with Connection type from it
import mongoose, { Connection } from "mongoose";

require("dotenv").config();

let cachedConnection: Connection | null = null;
// We don't need to actually return the connection.
// We just need to make sure it's connected.
export async function connectToMongoDB() {
	if (cachedConnection) {
		console.log("Using cached db connection");
	}
	try {
		const cnx = await mongoose.connect(process.env.MONGODB_URI!);
		cachedConnection = cnx.connection;

		console.log("New mongodb connection established");
	} catch (error) {
		console.log(error);
		throw error;
	}
}

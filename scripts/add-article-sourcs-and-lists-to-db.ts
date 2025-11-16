import { connectToMongoDB } from "../src/lib/mongo/db";

const preScript = async () => {
	await connectToMongoDB();
	console.log("Connected to MongoDB");
};

const runScript = async () => {
	await preScript();
	// Add your script logic here
};

runScript();

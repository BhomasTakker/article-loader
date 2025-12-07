import express from "express";

export const initialiseExpress = () => {
	const app = express();

	// Add middleware for parsing JSON request bodies
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	return app;
};

export const startServer = (app: express.Express) => {
	const port = process.env.PORT || 4000;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
};

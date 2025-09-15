import express from "express";

export const initialiseExpress = () => {
	const app = express();

	return app;
};

export const startServer = (app: express.Express) => {
	const port = process.env.PORT || 4000;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
};

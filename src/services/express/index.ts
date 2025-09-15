import express from "express";

export const initialiseExpress = () => {
	const app = express();
	const port = process.env.PORT || 4000;

	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});

	return app;
};

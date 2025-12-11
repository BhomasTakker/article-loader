import express from "express";
import cors from "cors";

export const initialiseExpress = () => {
	const app = express();

	// CORS - restrict CMS routes to admin frontend
	app.use(
		"/cms",
		cors({
			origin: process.env.ADMIN_ORIGIN || "http://localhost:3000",
			credentials: true,
			methods: ["GET", "PUT", "PATCH", "DELETE"],
		})
	);

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

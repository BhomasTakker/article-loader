import { Express } from "express";
import { cmsRoute } from "./cms";

export const initRoutes = (app: Express) => {
	app.get("/", async (req, res) => {
		res.send("Routes Home");
	});
	app.use("/cms", cmsRoute);
};

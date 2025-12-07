import { Express } from "express";

// We need to create routes for CMS management
// Getting, adding, updating providers
// Updating Articles
// Adding/updating source lists and sources
// Adding and updating cron jobs
////////////////////////////////////////
export const initCMSRoutes = (app: Express) => {
	app.get("/cms", async (req, res) => {
		res.send("CMS Management UI - Add sources, etc.");
	});
};

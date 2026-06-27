import { Router } from "express";
import { pingPythonService } from "../../../src/lib/python-service/client";

export const nlpRoute = Router();

nlpRoute.get("/ping", async (req, res) => {
	try {
		const result = await pingPythonService();
		res.json(result);
	} catch (err) {
		res.status(502).json({ error: "Python service unavailable" });
	}
});

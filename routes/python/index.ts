import { Router } from "express";
import { apiKeyAuth } from "../cms/middleware";
import { nlpRoute } from "./nlp/nlp";

export const pythonRoute = Router();

pythonRoute.get("/", async (req, res) => {
	res.send("Python API route - Add endpoints for Python service here.");
});

// apiKeyAuth
pythonRoute.use("/nlp", nlpRoute);

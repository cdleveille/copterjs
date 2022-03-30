import { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";

import log from "../services/log.js";
import { Routes } from "../types/constants.js";

const router = Router();

router.get(Routes.root, async (req: Request, res: Response): Promise<Response | void> => {
	try {
		if (fs.existsSync(path.join(process.cwd(), "build/public"))) {
			res.sendFile(path.join(process.cwd(), "build/public/index.html"));
		} else {
			res.send("Run 'yarn dev' or 'debug' launch config and go to http://localhost:3000/ to use front end (/build/public folder does not exist)");
		}
	} catch (error) {
		log.error(error);
	}
});

export default router;

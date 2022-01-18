import { Request, Response, Router } from "express";

import fs from "fs";
import path from "path";
import log from "../services/log";
import { Routes } from "../types/constants";

const router = Router();

router.get(Routes.root, async (req: Request, res: Response): Promise<Response | void> => {
	try {
		if (fs.existsSync(path.join(process.cwd(), "build/client"))) {
			res.sendFile(path.join(process.cwd(), "build/client/index.html"));
		} else {
			res.send("Run 'yarn dev' or 'debug' launch config and go to http://localhost:3000/ to use front end (/build/client folder does not exist)");
		}
	} catch (error) {
		log.error(error);
	}
});

export default router;

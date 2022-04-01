import { Request, Response, Router } from "express";
import path from "path";

import log from "../services/log";
import { Routes } from "../types/constants";

const router = Router();

router.get(Routes.root, async (req: Request, res: Response): Promise<Response | void> => {
	try {
		res.sendFile(path.join(process.cwd(), "build/client/index.html"));
	} catch (error) {
		log.error(error);
	}
});

export default router;

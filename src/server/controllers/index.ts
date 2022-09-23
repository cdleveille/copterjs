import { NextFunction, Request, Response, Router } from "express";

import { Score } from "../models/score";
import { IResponse } from "../types/abstract";
import { Routes } from "../types/constants";

const router = Router();

router.get(Routes.top10, async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		const scores = await Score.find({}, { player: 1, score: 1, _id: 0 }).sort({ score: -1 }).limit(10);

		return res.status(200).send({
			ok: true,
			status: 200,
			data: scores
		} as IResponse);
	} catch (error) {
		next(error);
	}
});

export default router;

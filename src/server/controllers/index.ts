import { NextFunction, Request, Response, Router } from "express";

import { EntityManager } from "@mikro-orm/core";

import { IResponse } from "../../shared/types/abstract";
import { Routes } from "../../shared/types/constants";
import { ScoreRepository } from "../repositories/ScoreRepository";

const router = Router();

router.get(Routes.top10, async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		const manager: EntityManager = res.locals.em;
		const scores = await ScoreRepository.FindTopTen(manager);

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

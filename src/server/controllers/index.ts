import { Request, Response, NextFunction, Router } from "express";
import path from "path";

import Config from "../helpers/config";
import { Routes } from "../../shared/types/constants";
import { RequestRepo, ScoreRepository } from "../repositories/ScoreRepository";
import { Score } from "../models/Score";
import { IScore, IResponse } from "../../shared/types/abstract";

const router = Router();

router.get(Routes.root, async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		res.sendFile(path.join(process.cwd(), Config.IS_PROD ? "build/client.min/index.html" : "build/client/index.html"));
	} catch (error) {
		next(error);
	}
});

router.get(Routes.top10, async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		const repo: RequestRepo = res.locals.em.getRepository(Score);

		const scores = await ScoreRepository.FindTopTen(repo);
		if (!scores) return res.status(500).send({
			ok: false,
			status: 500,
			data: "Unexpected error retrieving high scores!"
		} as IResponse);

		return res.status(200).send({
			ok: true,
			status: 200,
			data: scores
		} as IResponse);
	} catch (error) {
		next(error);
	}
});

router.post(Routes.newScore, async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		const score: IScore = req.body;
		if (!score.player || !score.score) {
			return res.status(400).send({
				ok: false,
				status: 400,
				data: "Bad request body!"
			} as IResponse);
		}
		const repo: RequestRepo = res.locals.em.getRepository(Score);

		const newScore = await ScoreRepository.InsertOne(repo, score);
		if (!newScore) return res.status(500).send({
			ok: false,
			status: 500,
			data: "Unexpected error posting new score!"
		} as IResponse);

		return res.status(200).send({
			ok: true,
			status: 200,
			data: newScore
		} as IResponse);
	} catch (error) {
		next(error);
	}
});

export default router;

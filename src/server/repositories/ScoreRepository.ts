import { EntityManager, QueryOrder } from "@mikro-orm/core";

import { IScore } from "../../shared/types/abstract";
import { Score } from "../models/Score";

export class ScoreRepository {
	public static async InsertOne(manager: EntityManager, score: IScore): Promise<Score> {
		try {
			const newScore = new Score({ player: score.player, score: score.score });

			await manager.persistAndFlush(newScore);
			return newScore;
		} catch (error) {
			throw Error(error);
		}
	}

	public static async InsertMany(manager: EntityManager, scores: IScore[]): Promise<boolean> {
		try {
			for (const score of scores) {
				const newScore = new Score({ player: score.player, score: score.score });
				manager.persist(newScore);
			}

			await manager.flush();
			return true;
		} catch (error) {
			throw Error(error);
		}
	}

	public static async FindTopTen(manager: EntityManager): Promise<Score[]> {
		try {
			const repo = manager.getRepository(Score);
			const scores = await repo.findAll({
				orderBy: { score: QueryOrder.DESC },
				limit: 10
			});
			return scores;
		} catch (error) {
			throw Error(error);
		}
	}
}

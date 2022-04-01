import { EntityRepository, QueryOrder } from "@mikro-orm/core";

import { Score } from "../models/Score";
import { IScore } from "../../shared/types/abstract";

export type RequestRepo = EntityRepository<Score>;

export class ScoreRepository {
	private static readonly CacheSize = 3000;

	public static async InsertOne(repo: RequestRepo, score: IScore): Promise<Score> {
		try {
			const newScore = new Score({ player: score.player, score: score.score });
			await repo.persistAndFlush(newScore);
			return newScore;
		} catch (error) {
			throw Error(error);
		}
	}

	public static async FindTopTen(repo: RequestRepo): Promise<Score[]> {
		try {
			return await repo.find({}, { cache: ScoreRepository.CacheSize, orderBy: { score: QueryOrder.DESC }, limit: 10 });
		} catch (error) {
			throw Error(error);
		}
	}
}

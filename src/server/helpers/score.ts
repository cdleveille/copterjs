import { EntityManager } from "@mikro-orm/core";

import { IScore, ISocket } from "../../shared/types/abstract";
import { ScoreRepository } from "../repositories/ScoreRepository";
import { Score } from "../models/Score";

export const validateScore = async (manager: EntityManager, score: IScore, socket: ISocket, skipMsg?: boolean) => {
	const inTopTen = await isScoreInTopTen(manager, score.score);
	if (!inTopTen) return;

	if (!score.player) return socket.emit("request_initials");

	if (!skipMsg) socket.emit("new_high_score");

	await insertScore(manager, score);
};

export const validateScoreSkipMsg = async (manager: EntityManager, score: IScore, socket: ISocket) => {
	await validateScore(manager, score, socket, true);
};

const isScoreInTopTen = async (manager: EntityManager, score: number): Promise<boolean> => {
	const highScores: Score[] = await ScoreRepository.FindTopTen(manager);
	if (highScores.length < 10) return true;

	for (const highScore of highScores) {
		if (score > highScore.score) return true;
	}

	return false;
};

const insertScore = async (manager: EntityManager, score: IScore) => {
	await ScoreRepository.InsertOne(manager, score);
};

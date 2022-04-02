import { EntityManager } from "@mikro-orm/core";

import { IScore, ISocket } from "../../shared/types/abstract";
import { ScoreRepository } from "../repositories/ScoreRepository";
import { Score } from "../models/Score";

export const validateScore = async (manager: EntityManager, score: IScore, socket: ISocket, skipMsg?: boolean) => {
	const inTopTen = await isScoreInTopTen(manager, score.score);
	if (!inTopTen) return;

	if (!score.player) return socket.emit("request_initials");

	if (!skipMsg) socket.emit("show_new_high_score_msg");

	await insertScore(manager, score, socket);
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

const insertScore = async (manager: EntityManager, score: IScore, socket: ISocket) => {
	await ScoreRepository.InsertOne(manager, score);
	await sendHighScoresToClient(manager, socket);
};

export const sendHighScoresToClient = async (manager: EntityManager, socket: ISocket) => {
	const highScores: Score[] = await ScoreRepository.FindTopTen(manager);
	socket.emit("high_scores_updated", highScores);
};

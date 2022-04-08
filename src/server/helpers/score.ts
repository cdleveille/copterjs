import { EntityManager } from "@mikro-orm/core";

import { IScore, ISocket } from "../../shared/types/abstract";
import { Score } from "../models/Score";
import { ScoreRepository } from "../repositories/ScoreRepository";

export const validateScores = async (manager: EntityManager, scores: IScore[], socket: ISocket, skipMsg?: boolean) => {
	for (const score of scores) {
		if (!score.player) return socket.emit("initials-request");
	}

	if (!skipMsg && scores.length === 1) socket.emit("show-new-high-score-msg");
	await insertScores(manager, scores, socket);
};

export const validateScoresSkipMsg = async (manager: EntityManager, scores: IScore[], socket: ISocket) => {
	await validateScores(manager, scores, socket, true);
};

const insertScores = async (manager: EntityManager, scores: IScore[], socket: ISocket) => {
	await ScoreRepository.InsertMany(manager, scores);
	await broadcastHighScoresToAllClients(manager, socket);
};

export const sendHighScoresToClient = async (manager: EntityManager, socket: ISocket) => {
	const highScores: Score[] = await ScoreRepository.FindTopTen(manager);
	socket.emit("high-scores-updated", highScores);
};

const broadcastHighScoresToAllClients = async (manager: EntityManager, socket: ISocket) => {
	const highScores: Score[] = await ScoreRepository.FindTopTen(manager);
	socket.broadcast.emit("high-scores-updated", highScores);
	socket.emit("high-scores-updated", highScores);
};

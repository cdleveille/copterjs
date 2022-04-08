import { EntityManager } from "@mikro-orm/core";

import { IScore, ISocket } from "../../shared/types/abstract";
import { Score } from "../models/Score";
import { ScoreRepository } from "../repositories/ScoreRepository";

export const validateScore = async (manager: EntityManager, score: IScore, socket: ISocket, skipMsg?: boolean) => {
	if (!score.player) return socket.emit("initials-request");
	if (!skipMsg) socket.emit("show-new-high-score-msg");
	await insertScore(manager, score, socket);
};

export const validateScoreSkipMsg = async (manager: EntityManager, score: IScore, socket: ISocket) => {
	await validateScore(manager, score, socket, true);
};

const insertScore = async (manager: EntityManager, score: IScore, socket: ISocket) => {
	await ScoreRepository.InsertOne(manager, score);
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

import { EntityManager } from "@mikro-orm/core";

import { IRun, IScore, ISocket } from "../../shared/types/abstract";
import { Score } from "../models/Score";
import { ScoreRepository } from "../repositories/ScoreRepository";

const activeRuns: { [id: string]: IRun } = {};
let tenthPlaceScore: number, lastPlayerInputPing: number;

export const startRun = (socket: ISocket) => {
	activeRuns[socket.id] = { startTime: new Date().getTime(), endTime: undefined };
};

export const endRun = async (manager: EntityManager, player: string, clientDistance: number, socket: ISocket) => {
	if (!activeRuns[socket.id]) return;
	activeRuns[socket.id].endTime = new Date().getTime();
	if (activeRuns[socket.id].endTime - lastPlayerInputPing > 2000) return;

	const distance = computeDistance(socket);
	socket.emit("report-distance-to-client", distance);
	if (Math.abs(distance - clientDistance) > 1) return;

	if (tenthPlaceScore && distance < tenthPlaceScore) return;

	if (!player) return socket.emit("initials-request");
	socket.emit("show-new-high-score-msg");

	await submitScore(manager, player, socket);
};

export const submitScore = async (manager: EntityManager, player: string, socket: ISocket) => {
	const distance = computeDistance(socket);
	if (tenthPlaceScore && distance < tenthPlaceScore) return;
	const score: IScore = { player, score: distance };
	deleteRun(socket.id);
	await insertScore(manager, score, socket);
};

export const deleteRun = (id: string) => {
	delete activeRuns[id];
};

const computeDistance = (socket: ISocket): number => {
	return Math.floor((activeRuns[socket.id].endTime - activeRuns[socket.id].startTime) / 30);
};

export const ping = () => {
	lastPlayerInputPing = new Date().getTime();
};

const insertScore = async (manager: EntityManager, score: IScore, socket: ISocket) => {
	await ScoreRepository.InsertOne(manager, score);
	await broadcastHighScoresToAllClients(manager, socket);
};

export const sendHighScoresToClient = async (manager: EntityManager, socket: ISocket) => {
	const highScores: Score[] = await ScoreRepository.FindTopTen(manager);
	if (highScores.length === 10) tenthPlaceScore = highScores[9].score;
	socket.emit("high-scores-updated", highScores);
};

const broadcastHighScoresToAllClients = async (manager: EntityManager, socket: ISocket) => {
	const highScores: Score[] = await ScoreRepository.FindTopTen(manager);
	if (highScores.length === 10) tenthPlaceScore = highScores[9].score;
	socket.broadcast.emit("high-scores-updated", highScores);
	socket.emit("high-scores-updated", highScores);
};

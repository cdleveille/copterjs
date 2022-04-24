import { Socket } from "socket.io";

import { EntityManager } from "@mikro-orm/core";
import { IScore } from "@shared/types/abstract";

import { Score } from "../models/Score";
import { ScoreRepository } from "../repositories/ScoreRepository";
import { IRun } from "../types/abstract";
import Config from "./config";

const activeRuns: { [id: string]: IRun } = {};

export const startRun = (socket: Socket) => {
	activeRuns[socket.id] = { startTime: new Date().getTime(), endTime: undefined, lastPing: new Date().getTime() };
};

export const endRun = async (manager: EntityManager, player: string, clientDistance: number, socket: Socket) => {
	if (!Config.USE_DB) return;
	if (!activeRuns[socket.id]) return;

	activeRuns[socket.id].endTime = new Date().getTime();
	if (activeRuns[socket.id].endTime - activeRuns[socket.id].lastPing > 3000) return deleteRun(socket.id);

	const distance = computeDistance(socket);
	socket.emit("report-distance-to-client", distance);
	if (Math.abs(distance - clientDistance) > 100) return deleteRun(socket.id);

	const tenthPlaceScore = await getTenthPlaceScore(manager);
	if (tenthPlaceScore && distance < tenthPlaceScore) return;

	if (!player) return socket.emit("initials-request");
	socket.emit("show-new-high-score-msg");

	await submitScore(manager, player, socket);
	deleteRun(socket.id);
};

export const submitScore = async (manager: EntityManager, player: string, socket: Socket) => {
	if (!Config.USE_DB) return;
	if (!activeRuns[socket.id]) return;

	const distance = computeDistance(socket);

	const score: IScore = { player: player.toUpperCase().substring(0, 3), score: distance };
	await insertScore(manager, score, socket);
};

export const deleteRun = (id: string) => {
	delete activeRuns[id];
};

const computeDistance = (socket: Socket): number => {
	return Math.floor((activeRuns[socket.id].endTime - activeRuns[socket.id].startTime) / 30);
};

export const ping = (socket: Socket) => {
	if (!Config.USE_DB) return;
	if (!activeRuns[socket.id]) return;

	const newPing = new Date().getTime();
	if (newPing - activeRuns[socket.id].lastPing > 3000) return deleteRun(socket.id);
	activeRuns[socket.id].lastPing = newPing;
};

const insertScore = async (manager: EntityManager, score: IScore, socket: Socket) => {
	await ScoreRepository.InsertOne(manager, score);
	await sendHighScoresToClient(manager, socket, true);
};

export const sendHighScoresToClient = async (manager: EntityManager, socket: Socket, broadcast?: boolean) => {
	if (!Config.USE_DB) return;
	const highScores: Score[] = await ScoreRepository.FindTop(manager, 10);
	socket.emit("high-scores-updated", highScores);
	if (broadcast) socket.broadcast.emit("high-scores-updated", highScores);
};

const getTenthPlaceScore = async (manager: EntityManager): Promise<number> => {
	const highScores: Score[] = await ScoreRepository.FindTop(manager, 10);
	return highScores.length === 10 ? highScores[highScores.length - 1].score : null;
};

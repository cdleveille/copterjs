import { Socket } from "socket.io";

import { EntityManager } from "@mikro-orm/core";
import { IScore } from "@shared/types/abstract";

import { Score } from "../models/Score";
import { ScoreRepository } from "../repositories/ScoreRepository";
import { IRun } from "../types/abstract";
import Config from "./config";

const activeRuns: { [id: string]: IRun } = {};
let tenthPlaceScore: number, lastPlayerInputPing: number;

export const startRun = (socket: Socket) => {
	activeRuns[socket.id] = { startTime: new Date().getTime(), endTime: undefined };
};

export const endRun = async (manager: EntityManager, player: string, clientDistance: number, socket: Socket) => {
	if (!activeRuns[socket.id]) return;
	activeRuns[socket.id].endTime = new Date().getTime();
	if (activeRuns[socket.id].endTime - lastPlayerInputPing > 2000) return deleteRun(socket.id);

	const distance = computeDistance(socket);
	socket.emit("report-distance-to-client", distance);
	// if (Math.abs(distance - clientDistance) > 100) return deleteRun(socket.id);

	if (tenthPlaceScore && distance < tenthPlaceScore) return;

	if (!player) return socket.emit("initials-request");
	socket.emit("show-new-high-score-msg");

	await submitScore(manager, player, socket);
};

export const submitScore = async (manager: EntityManager, player: string, socket: Socket) => {
	if (!Config.USE_DB) return;
	if (!activeRuns[socket.id]) return;

	const distance = computeDistance(socket);
	if (tenthPlaceScore && distance < tenthPlaceScore) return;

	const score: IScore = { player: player.toUpperCase(), score: distance };
	await insertScore(manager, score, socket);

	deleteRun(socket.id);
};

export const deleteRun = (id: string) => {
	if (!activeRuns[id]) return;
	delete activeRuns[id];
};

const computeDistance = (socket: Socket): number => {
	return Math.floor((activeRuns[socket.id].endTime - activeRuns[socket.id].startTime) / 30);
};

export const ping = (socket: Socket) => {
	if (!activeRuns[socket.id]) return;
	const newPing = new Date().getTime();
	if (newPing - lastPlayerInputPing > 2000) deleteRun(socket.id);
};

const insertScore = async (manager: EntityManager, score: IScore, socket: Socket) => {
	await ScoreRepository.InsertOne(manager, score);
	await sendHighScoresToClient(manager, socket, true);
};

export const sendHighScoresToClient = async (manager: EntityManager, socket: Socket, broadcast?: boolean) => {
	if (!Config.USE_DB) return;
	const highScores: Score[] = await ScoreRepository.FindTop(manager, 10);
	if (highScores.length === 10) tenthPlaceScore = highScores[highScores.length - 1].score;
	socket.emit("high-scores-updated", highScores);
	if (broadcast) socket.broadcast.emit("high-scores-updated", highScores);
};

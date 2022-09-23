import { Socket } from "socket.io";

import { IScore } from "@shared/types/abstract";

import { Score } from "../models/score";
import { IRun } from "../types/abstract";
import Config from "./config";

const activeRuns: { [id: string]: IRun } = {};

export const startRun = (socket: Socket) => {
	activeRuns[socket.id] = { startTime: new Date().getTime(), endTime: undefined, lastPing: new Date().getTime() };
};

export const endRun = async (player: string, clientDistance: number, socket: Socket) => {
	if (!Config.USE_DB) return;
	if (!activeRuns[socket.id]) return;

	activeRuns[socket.id].endTime = new Date().getTime();
	if (activeRuns[socket.id].endTime - activeRuns[socket.id].lastPing > 3000) return deleteRun(socket.id);

	const distance = computeDistance(socket);
	socket.emit("report-distance-to-client", distance);
	if (Math.abs(distance - clientDistance) > 100) return deleteRun(socket.id);

	const tenthPlaceScore = await getTenthPlaceScore();
	if (tenthPlaceScore && distance < tenthPlaceScore) return;

	if (!player) return socket.emit("initials-request");
	socket.emit("show-new-high-score-msg");

	await submitScore(player, socket);
	deleteRun(socket.id);
};

export const submitScore = async (player: string, socket: Socket) => {
	if (!Config.USE_DB) return;
	if (!activeRuns[socket.id]) return;

	const distance = computeDistance(socket);

	const score: IScore = { player: player.toUpperCase().substring(0, 3), score: distance };
	await insertScore(score, socket);
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

const insertScore = async (score: IScore, socket: Socket) => {
	await Score.create(score);
	await sendHighScoresToClient(socket, true);
};

export const sendHighScoresToClient = async (socket: Socket, broadcast?: boolean) => {
	if (!Config.USE_DB) return;
	const highScores: IScore[] = await Score.find({}, { player: 1, score: 1, _id: 0 }).sort({ score: -1 }).limit(10);
	socket.emit("high-scores-updated", highScores);
	if (broadcast) socket.broadcast.emit("high-scores-updated", highScores);
};

const getTenthPlaceScore = async (): Promise<number> => {
	const highScores: IScore[] = await Score.find({}, { player: 1, score: 1, _id: 0 }).sort({ score: -1 }).limit(10);
	return highScores.length === 10 ? highScores[highScores.length - 1].score : null;
};

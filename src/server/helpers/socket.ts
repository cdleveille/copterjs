import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

import { EntityManager } from "@mikro-orm/core";
import { IEnv, IScore } from "@shared/types/abstract";

import { deleteRun, endRun, ping, sendHighScoresToClient, startRun, submitScore } from "../helpers/score";
import Config from "./config";

export const initSocket = (httpServer: HttpServer, manager: EntityManager) => {
	const io = new Server(httpServer);

	io.on("connect", (socket: Socket) => {
		deleteRun(socket.id);

		socket.on("start-run", () => {
			startRun(socket);
		});

		socket.on("end-run", async (data: IScore) => {
			await endRun(manager, data.player, data.score, socket);
		});

		socket.on("submit-score", async (player: string) => {
			await submitScore(manager, player, socket);
		});

		socket.on("player-input-ping", () => {
			ping(socket);
		});

		socket.on("high-scores-request", async () => {
			await sendHighScoresToClient(manager, socket);
		});

		socket.on("env-var-request", async () => {
			socket.emit("env-var-send", { IS_PROD: Config.IS_PROD, USE_DB: Config.USE_DB } as IEnv);
		});

		socket.on("disconnect", () => {
			deleteRun(socket.id);
		});
	});
};

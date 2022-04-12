import compression from "compression";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import { IEnvVars, IScore } from "../../../build/shared/types/abstract";
import { ISocket } from "../../shared/types/abstract";
import router from "../controllers/index";
import Config from "../helpers/config";
import { deleteRun, endRun, ping, sendHighScoresToClient, startRun, submitScore } from "../helpers/score";
import { Routes } from "../types/constants";
import { Database } from "./db";
import log from "./log";

export default class App {
	private static instance: Express;

	private static async setup() {
		App.instance = express();

		const logStream = fs.createWriteStream("combined.log", { flags: "a" });
		App.instance.use(morgan("combined", { stream: logStream }));

		App.instance.use((req: Request, res: Response, next: NextFunction) => {
			res.locals.em = Config.USE_DB ? Database.Manager.fork() : null;
			next();
		});

		App.instance.use(
			helmet.contentSecurityPolicy({
				directives: {
					"default-src": ["'self'"],
					"object-src": ["'none'"],
					"script-src": ["'self'", "'unsafe-eval'"],
					"style-src": ["'self'", "'unsafe-inline'"],
					"font-src": ["'self'"],
					"img-src": ["'self' blob: data:"],
					"connect-src": ["'self'"]
				}
			})
		);

		App.instance.use(compression());

		App.instance.use(
			cors({
				origin: "*",
				methods: ["GET"]
			})
		);

		App.instance.use(Routes.root, router);

		App.instance.use(
			express.static(path.join(process.cwd(), Config.IS_PROD ? "build/client.min" : "build/client"))
		);

		App.instance.set("json spaces", 2);

		App.instance.disabled("x-powered-by");
	}

	public static async start() {
		if (Config.USE_DB) await Database.Connect();
		await App.setup();

		const manager = Config.USE_DB ? Database.Manager.fork() : null;

		const http = require("http").Server(App.instance);
		const io = require("socket.io")(http);

		io.on("connect", (socket: ISocket) => {
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
				socket.emit("env-var-send", { IS_PROD: Config.IS_PROD, USE_DB: Config.USE_DB } as IEnvVars);
			});

			socket.on("disconnect", () => {
				deleteRun(socket.id);
			});
		});

		http.listen(Config.PORT, () => {
			log.info(`Server started - listening on http://${Config.HOST}:${Config.PORT}`);
		});
	}
}

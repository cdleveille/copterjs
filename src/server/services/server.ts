import compression from "compression";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import { IScore, ISocket } from "../../shared/types/abstract";
import { Routes } from "../../shared/types/constants";
import router from "../controllers/index";
import Config from "../helpers/config";
import { sendHighScoresToClient, validateScore, validateScoreSkipMsg } from "../helpers/score";
import { Database } from "./db";
import log from "./log";

export default class App {
	private static instance: Express;

	private static async setup() {
		App.instance = express();

		const logStream = fs.createWriteStream("combined.log", { flags: "a" });
		App.instance.use(morgan("combined", { stream: logStream }));

		App.instance.use((req: Request, res: Response, next: NextFunction) => {
			res.locals.em = Database.Manager.fork();
			next();
		});

		App.instance.use(
			helmet.contentSecurityPolicy({
				directives: {
					"default-src": ["'self'"],
					"object-src": ["'none'"],
					"script-src": [
						"'self'",
						"'unsafe-inline'",
						"'unsafe-eval'",
						"code.jquery.com",
						"cdnjs.cloudflare.com"
					],
					"style-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
					"font-src": ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "fonts.gstatic.com"],
					"img-src": ["'self' blob: data:"],
					"connect-src": ["'self'", "googletagmanager.com"]
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
		await Database.Connect();
		await App.setup();

		const manager = Database.Manager.fork();

		const http = require("http").Server(App.instance);
		const io = require("socket.io")(http);

		io.on("connect", (socket: ISocket) => {
			socket.on("validate-score", async (score: IScore) => {
				await validateScore(manager, score, socket);
			});

			socket.on("validate-score-skip-msg", async (score: IScore) => {
				await validateScoreSkipMsg(manager, score, socket);
			});

			socket.on("high-scores-request", async () => {
				await sendHighScoresToClient(manager, socket);
			});
		});

		http.listen(Config.PORT, () => {
			log.info(`Server started - listening on http://${Config.HOST}:${Config.PORT}`);
		});
	}
}

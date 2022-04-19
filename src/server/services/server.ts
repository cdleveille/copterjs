import compression from "compression";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import fs from "fs";
import helmet from "helmet";
import { createServer } from "http";
import morgan from "morgan";
import path from "path";

import router from "../controllers/index";
import Config from "../helpers/config";
import { initSocket } from "../helpers/socket";
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

		App.instance.use(express.static(path.join(process.cwd(), "build/client")));

		App.instance.set("json spaces", 2);

		App.instance.disable("x-powered-by");
	}

	public static async start() {
		if (Config.USE_DB) await Database.Connect();
		await App.setup();

		const httpServer = createServer(App.instance);
		const manager = Config.USE_DB ? Database.Manager.fork() : null;
		initSocket(httpServer, manager);

		httpServer.listen(Config.PORT, () => {
			log.info(
				`Server started - listening on http${Config.IS_PROD ? "s" : ""}://${Config.HOST}${
					Config.IS_PROD ? "" : ":" + Config.PORT
				}`
			);
		});
	}
}

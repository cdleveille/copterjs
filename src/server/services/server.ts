import compression from "compression";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import log from "./log";
import Config from "../helpers/config";
import { Database } from "./db";

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
					"script-src": ["'self'", "'unsafe-inline'", "code.jquery.com", "cdnjs.cloudflare.com"],
					"style-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
					"font-src": ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "fonts.gstatic.com"],
					"img-src": ["'self' blob: data:"]
				},
			})
		);
		App.instance.use(compression());
		App.instance.use(cors({
			origin: "*",
			methods: ["GET, POST"]
		}));

		App.instance.use(express.static(path.join(process.cwd(), Config.IS_PROD ? "build/client.min" : "build/client")));

		App.instance.set("json spaces", 2);
		App.instance.disabled("x-powered-by");
	}

	public static async start() {
		await Database.Connect();
		await App.setup();

		App.instance.listen(Config.PORT);
		log.info(`Server started - listening on http://${Config.HOST}:${Config.PORT}`);
	}
}

import compression from "compression";
import cors from "cors";
import express from "express";
import fs from "fs";
import helmet from "helmet";
import { createServer } from "http";
import morgan from "morgan";
import path from "path";

import router from "../controllers/index";
import Config from "../helpers/config";
import { initSocket } from "../helpers/socket";
import { Routes } from "../types/constants";
import { connectToDatabase } from "./db";
import log from "./log";

export const startServer = async () => {
	const app = express();
	if (Config.USE_DB) await connectToDatabase();

	const logStream = fs.createWriteStream("combined.log", { flags: "a" });
	app.use(morgan("combined", { stream: logStream }));
	app.use(
		helmet.contentSecurityPolicy({
			directives: {
				"default-src": ["'self'"],
				"object-src": ["'none'"],
				"script-src": ["'self'", "'unsafe-eval'"],
				"style-src": ["'self'", "'unsafe-inline'"],
				"img-src": ["'self' blob: data:"],
				"connect-src": ["'self'", "www.googletagmanager.com"]
			}
		})
	);
	app.use(compression());
	app.use(
		cors({
			origin: "*",
			methods: ["GET"]
		})
	);
	app.use(Routes.root, router);
	app.use(express.static(path.join(process.cwd(), "build/client")));
	app.set("json spaces", 2);
	app.disable("x-powered-by");

	const httpServer = createServer(app);
	initSocket(httpServer);
	httpServer.listen(Config.PORT, () => {
		log.info(`Server started${Config.IS_PROD ? "." : ` - listening on http://localhost:${Config.PORT}`}`);
	});
};

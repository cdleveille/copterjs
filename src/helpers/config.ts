import "dotenv/config";
import os from "os";
import path from "path";

import { Env, Host } from "../types/constants";

const Config = {
	IS_COMPILED: <boolean>path.extname(__filename).includes("js"),
	IS_PROD: <boolean>(process.env.NODE_ENV === Env.prod),
	PORT: <number>(parseInt(process.env.PORT) || 3000),
	HOST: <string>(process.env.NODE_ENV === Env.prod ? process.env.HOST : Host.local || Host.ip),
	CORES: <number>os.cpus().length
};

export default Config;

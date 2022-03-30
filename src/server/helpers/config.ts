import "dotenv/config";
import os from "os";

import { Env, Host } from "../types/constants.js";

const Config = {
	IS_PROD: <boolean>(process.env.NODE_ENV === Env.prod),
	PORT: <number>(parseInt(process.env.PORT) || 3000),
	HOST: <string>(process.env.NODE_ENV === Env.prod ? process.env.HOST : Host.local || Host.ip),
	CORES: <number>os.cpus().length
};

export default Config;

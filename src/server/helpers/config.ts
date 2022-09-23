import "dotenv/config";

import { Env } from "../types/constants";

const Config = {
	IS_PROD: <boolean>(process.env.NODE_ENV === Env.prod),
	USE_DB: <boolean>(process.env.USE_DB === "true"),
	PORT: <number>(parseInt(process.env.PORT) || 3000),
	MONGO_URI: <string>process.env.MONGO_URI || "mongodb://localhost:27037/copterjs"
};

export default Config;

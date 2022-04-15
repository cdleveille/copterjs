import "dotenv/config";

import { Env, Host } from "../types/constants";

const Config = {
	IS_PROD: <boolean>(process.env.NODE_ENV === Env.prod),
	USE_DB: <boolean>(process.env.USE_DB === "true"),
	PORT: <number>(parseInt(process.env.PORT) || 3000),
	HOST: <string>(process.env.NODE_ENV === Env.prod ? Host.prod : Host.dev)
};

export const Db = {
	DB_URL: <string>process.env.DATABASE_URL,
	DB_TYPE: <string>process.env.DB_TYPE,
	DB_HOST: <string>process.env.DB_HOST,
	DB_PORT: <number>parseInt(process.env.DB_PORT),
	DB_USERNAME: <string>process.env.DB_USERNAME,
	DB_PASSWORD: <string>process.env.DB_PASSWORD,
	DB_NAME: <string>process.env.DB_NAME,
	DB_SYNC: <boolean>(process.env.NODE_ENV !== Env.prod),
	DB_LOGGING: <boolean>(process.env.NODE_ENV !== Env.prod)
};

export default Config;

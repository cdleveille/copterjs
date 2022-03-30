import log from "./services/log.js";
import app from "./services/server.js";

(async () => {
	try {
		await app.start();
	} catch (error) {
		log.error(error);
		process.exit(1);
	}
})();

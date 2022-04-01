import log from "./services/log";
import app from "./services/server";

(async () => {
	try {
		await app.start();
	} catch (error) {
		log.error(error);
		process.exit(1);
	}
})();

import log from "./services/log.js";
import app from "./services/server.js";

process.on("uncaughtException", (error) => {
	log.error(error);
	process.exit(1);
});

(async () => {
	try {
		await app.start();
	} catch (error) {
		log.error(error);
		process.exit(1);
	}
})();

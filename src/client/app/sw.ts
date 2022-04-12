if (!navigator.serviceWorker.controller)
	await navigator.serviceWorker.register("../service-worker.js", { type: "module" });

export type {};

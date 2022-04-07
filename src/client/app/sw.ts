if (navigator.serviceWorker.controller) {
	console.log("active service worker found");
} else {
	await navigator.serviceWorker.register("../service-worker.js", { type: "module" });
	console.log("service worker registered");
}

export type {};

/// <reference lib="WebWorker" />

declare const self: ServiceWorkerGlobalScope;

const cacheName = "::swcache";
const version = "v0.0.1";

self.addEventListener("install", (event) => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(version + cacheName).then((cache) => {
			return cache.addAll([
				"./app/types/abstract.js",
				"./app/types/constant.js",
				"./app/copter.js",
				"./app/game.js",
				"./app/index.js",
				"./app/input.js",
				"./app/sw.js",
				"./app/terrain.js",
				"./app/util.js",
				"./app/window.js",
				"./css/style.css",
				"./font/digital-7 (mono).ttf",
				"./img/icons/favicon.ico",
				"./img/icons/icon_48x48.png",
				"./img/icons/icon_64x64.png",
				"./img/icons/icon_72x72.png",
				"./img/icons/icon_96x96.png",
				"./img/icons/icon_128x128.png",
				"./img/icons/icon_144x144.png",
				"./img/icons/icon_168x168.png",
				"./img/icons/icon_192x192.png",
				"./img/icons/icon_256x256.png",
				"./img/icons/icon_384x384.png",
				"./img/icons/icon_512x512.png",
				"./img/copter_stopped.png",
				"./img/copter1.png",
				"./img/copter2.png",
				"./img/copter3.png",
				"./img/copter4.png",
				"./img/copter5.png",
				"./img/copter6.png",
				"./img/copter7.png",
				"./img/copter8.png",
				"./img/copter9.png",
				"./img/copter10.png",
				"./img/copter11.png",
				"./img/copter12.png",
				"./img/copter13.png",
				"./img/copter14.png",
				"./img/copter15.png",
				"./img/copter16.png",
				"./img/copter17.png",
				"./img/copter18.png",
				"./img/copter19.png",
				"./img/copter20.png",
				"./img/copter21.png",
				"./img/copter22.png",
				"./img/copter23.png",
				"./img/copter24.png",
				"./img/copter25.png",
				"./img/smoke.png",
				"./index.html",
				"./manifest.json",
				"./service-worker.js"
			]);
		})
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			// remove caches whose name is no longer valid
			return Promise.all(
				keys
					.filter((key) => {
						return key.indexOf(version) !== 0;
					})
					.map((key) => {
						return caches.delete(key);
					})
			);
		})
	);
});

self.addEventListener("fetch", (event) => {
	// fetch from network first, falling back to cache on error
	event.respondWith(
		(async () => {
			try {
				const networkResponse = await fetch(event.request);
				const cache = await caches.open(version + cacheName);
				if (event.request.method !== "POST") {
					event.waitUntil(cache.put(event.request, networkResponse.clone()));
				}
				return networkResponse;
			} catch (err) {
				return caches.match(event.request);
			}
		})()
	);
});

export type {};
/// <reference lib="WebWorker" />

declare const self: ServiceWorkerGlobalScope;

const cacheName = "::swcache";
const version = "v0.0.1";

self.addEventListener("install", (event: ExtendableEvent) => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(version + cacheName).then((cache: Cache) => {
			return cache.addAll([
				"./img/icons/icon_16x16.png",
				"./img/icons/icon_32x32.png",
				"./img/icons/icon_48x48.png",
				"./img/icons/icon_64x64.png",
				"./img/icons/icon_72x72.png",
				"./img/icons/icon_96x96.png",
				"./img/icons/icon_128x128.png",
				"./img/icons/icon_144x144.png",
				"./img/icons/icon_168x168.png",
				"./img/icons/icon_180x180.png",
				"./img/icons/icon_192x192_maskable.png",
				"./img/icons/icon_192x192.png",
				"./img/icons/icon_256x256.png",
				"./img/icons/icon_384x384.png",
				"./img/icons/icon_512x512_maskable.png",
				"./img/icons/icon_512x512.png",
				"./img/icons/msapplication-icon-144x144.png",
				"./img/icons/mstile-150x150.png",
				"./img/icons/tile70x70.png",
				"./img/icons/tile150x150.png",
				"./img/icons/tile310x150.png",
				"./img/icons/tile310x310.png",
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
				"./browserconfig.xml",
				"./bundle.js",
				"./digital-7 (mono).ttf",
				"./favicon.ico",
				"./index.html",
				"./manifest.json",
				"./sw.js"
			]);
		})
	);
});

self.addEventListener("activate", (event: ExtendableEvent) => {
	event.waitUntil(
		caches.keys().then((keys: string[]) => {
			// remove caches whose name is no longer valid
			return Promise.all(
				keys
					.filter((key: string) => {
						return key.indexOf(version) !== 0;
					})
					.map((key: string) => {
						return caches.delete(key);
					})
			);
		})
	);
});

self.addEventListener("fetch", (event: FetchEvent) => {
	// fetch from network first, falling back to cache on error
	event.respondWith(
		(async () => {
			try {
				const networkResponse = await fetch(event.request);
				console.log(networkResponse);
				const cache = await caches.open(version + cacheName);
				if (event.request.method !== "POST") {
					event.waitUntil(cache.put(event.request, networkResponse.clone()));
				}
				return networkResponse;
			} catch (error) {
				return caches.match(event.request);
			}
		})()
	);
});

export type {};

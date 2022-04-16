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
				"./assets/copter_stopped.png",
				"./assets/copter1.png",
				"./assets/copter2.png",
				"./assets/copter3.png",
				"./assets/copter4.png",
				"./assets/copter5.png",
				"./assets/copter6.png",
				"./assets/copter7.png",
				"./assets/copter8.png",
				"./assets/copter9.png",
				"./assets/copter10.png",
				"./assets/copter11.png",
				"./assets/copter12.png",
				"./assets/copter13.png",
				"./assets/copter14.png",
				"./assets/copter15.png",
				"./assets/copter16.png",
				"./assets/copter17.png",
				"./assets/copter18.png",
				"./assets/copter19.png",
				"./assets/copter20.png",
				"./assets/copter21.png",
				"./assets/copter22.png",
				"./assets/copter23.png",
				"./assets/copter24.png",
				"./assets/copter25.png",
				"./assets/digital-7 (mono).ttf",
				"./assets/smoke.png",
				"./browserconfig.xml",
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
	event.respondWith(
		(async () => {
			if (event.request.url.includes("bundle-")) return cacheFirst(event);
			return networkFirst(event);
		})()
	);
});

const networkFirst = async (event: FetchEvent): Promise<Response> => {
	try {
		const networkResponse = await fetch(event.request);
		if (event.request.method !== "POST" && !event.request.url.includes("socket.io")) {
			const cache = await caches.open(version + cacheName);
			if (event.request.url.includes("bundle-")) {
				(await cache.keys()).map(async (key: Request) => {
					if (key.url.includes("bundle-")) await cache.delete(key);
				});
			}
			event.waitUntil(cache.put(event.request, networkResponse.clone()));
		}
		return networkResponse;
	} catch (error) {
		return cacheFirst(event);
	}
};

const cacheFirst = async (event: FetchEvent): Promise<Response> => {
	try {
		const cache = await caches.open(version + cacheName);
		const cacheResponse = await cache.match(event.request);
		return cacheResponse || networkFirst(event);
	} catch (error) {
		return networkFirst(event);
	}
};

export type {};

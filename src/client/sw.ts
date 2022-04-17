/// <reference lib="WebWorker" />

import { PrecacheEntry } from "workbox-precaching";

// @ts-ignore
declare const self: ServiceWorkerGlobalScope;

const manifest = self.__WB_MANIFEST as PrecacheEntry[];

const cacheName = "swcache_" + new Date().toISOString();

const cacheFirstFilePatterns: string[] = [".bundle.js", "favicon.ico", "/font/", "/img/", "browserconfig.xml"];

const isCacheFirstFile = (url: string) => {
	for (const pattern of cacheFirstFilePatterns) {
		if (url.includes(pattern)) return true;
	}
	return false;
};

self.addEventListener("install", (event: ExtendableEvent) => {
	self.skipWaiting();
	event.waitUntil(
		(async () => {
			// once page is loaded and service worker is installed, immediately fetch and cache every
			// entry in the manifest so offline play is possible without a subsequent page refresh
			const cache = await caches.open(cacheName);

			for (const entry of manifest) {
				if (!entry.url.endsWith("LICENSE.txt")) {
					const response = await fetch(entry.url);
					await cache.put(entry.url, response.clone());
				}
			}

			const rootResponse = await fetch("/");
			await cache.put("/", rootResponse.clone());
		})()
	);
});

self.addEventListener("activate", (event: ExtendableEvent) => {
	// remove old caches
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			return keys.map(async (cache) => {
				if (cache !== cacheName) {
					return await caches.delete(cache);
				}
			});
		})()
	);
});

self.addEventListener("fetch", (event: FetchEvent) => {
	event.respondWith(
		(async () => {
			if (event.request.url.includes("googletagmanager.com")) return {} as Response;
			if (isCacheFirstFile(event.request.url)) return cacheFirst(event);
			return networkFirst(event);
		})()
	);
});

const networkFirst = async (event: FetchEvent): Promise<Response> => {
	try {
		const networkResponse = await fetch(event.request);
		if (event.request.method !== "POST" && !event.request.url.includes("socket.io")) {
			const cache = await caches.open(cacheName);
			await cleanCache(event, cache);
			event.waitUntil(await cache.put(event.request, networkResponse.clone()));
		}
		return networkResponse;
	} catch (error) {
		return cacheFirst(event);
	}
};

const cacheFirst = async (event: FetchEvent): Promise<Response> => {
	try {
		const cache = await caches.open(cacheName);
		const cacheResponse = await cache.match(event.request);
		return cacheResponse || networkFirst(event);
	} catch (error) {
		return networkFirst(event);
	}
};

// clean up old versions of files with hashed filenames when a new version is fetched over the network
const cleanCache = async (event: FetchEvent, cache: Cache) => {
	if (event.request.url.includes("_hash_")) {
		const prefix = event.request.url.split("_hash_")[0];
		(await cache.keys()).map(async (key: Request) => {
			if (key.url.startsWith(prefix)) await cache.delete(key);
		});
	}
};

export type {};
